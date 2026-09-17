require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('./models/Book');
const Member = require('./models/Member');
const Transaction = require('./models/Transaction');

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/library_management';
(async () => {
  await mongoose.connect(uri);
  await Promise.all([Book.deleteMany({}), Member.deleteMany({}), Transaction.deleteMany({})]);
  const books = await Book.insertMany([
    { title:'Clean Code', author:'Robert C. Martin', isbn:'9780132350884', category:'Programming', publisher:'Prentice Hall', publishedYear:2008, totalCopies:4, availableCopies:4 },
    { title:'The Alchemist', author:'Paulo Coelho', isbn:'9780061122415', category:'Fiction', publisher:'HarperOne', publishedYear:1993, totalCopies:5, availableCopies:5 },
    { title:'Atomic Habits', author:'James Clear', isbn:'9780735211292', category:'Self Help', publisher:'Avery', publishedYear:2018, totalCopies:3, availableCopies:3 },
    { title:'Database System Concepts', author:'Abraham Silberschatz', isbn:'9780078022159', category:'Database', publisher:'McGraw-Hill', publishedYear:2019, totalCopies:2, availableCopies:2 },
    { title:'The Pragmatic Programmer', author:'David Thomas', isbn:'9780135957059', category:'Programming', publisher:'Addison-Wesley', publishedYear:2019, totalCopies:3, availableCopies:3 }
  ]);
  const members = await Member.insertMany([
    { name:'Aarav Sharma', email:'aarav@example.com', phone:'9876543210', address:'Jaipur' },
    { name:'Priya Verma', email:'priya@example.com', phone:'9876501234', address:'Jaipur' },
    { name:'Rahul Singh', email:'rahul@example.com', phone:'9123456780', address:'Ajmer' },
    { name:'Ananya Mehta', email:'ananya@example.com', phone:'9988776655', address:'Jaipur' }
  ]);
  await Transaction.create([
    { book: books[0]._id, member: members[0]._id, dueDate: new Date(Date.now() + 7*86400000) },
    { book: books[2]._id, member: members[1]._id, dueDate: new Date(Date.now() - 2*86400000), status:'Overdue' }
  ]);
  await Book.findByIdAndUpdate(books[0]._id, { $inc:{ availableCopies:-1 } });
  await Book.findByIdAndUpdate(books[2]._id, { $inc:{ availableCopies:-1 } });
  console.log('Demo data inserted successfully.');
  await mongoose.disconnect();
})().catch(err => { console.error(err.message); process.exit(1); });
