require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const methodOverride = require('method-override');
const path = require('path');

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/library_management';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: process.env.SESSION_SECRET || 'change-me', resave: false, saveUninitialized: false }));

app.use((req, res, next) => {
  res.locals.path = req.path;
  res.locals.appName = 'LibTrack';
  res.locals.success = req.query.success || '';
  next();
});

app.use('/', require('./routes/index'));
app.use('/books', require('./routes/books'));
app.use('/members', require('./routes/members'));
app.use('/transactions', require('./routes/transactions'));

app.use((req, res) => res.status(404).render('404', { title: 'Page Not Found' }));
app.use((err, req, res, next) => {
  console.error(err);
  const message = err.code === 11000 ? 'A record with the same unique value already exists.' : (err.message || 'Unexpected server error.');
  res.status(err.status || 500).render('500', { title: 'Something Went Wrong', error: { message } });
});

async function start() {
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log(`MongoDB connected: ${mongoose.connection.name}`);
    app.listen(PORT, () => console.log(`LibTrack running at http://localhost:${PORT}`));
  } catch (err) {
    console.error('\nMongoDB connection failed.');
    console.error(`URI: ${MONGODB_URI.replace(/:\/\/.*@/, '://***@')}`);
    console.error(`Reason: ${err.message}`);
    console.error('\nStart MongoDB or set MONGODB_URI in .env, then run npm start again.');
    process.exit(1);
  }
}

start();
