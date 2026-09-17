const mongoose = require('mongoose');
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  isbn: { type: String, required: true, unique: true, trim: true },
  category: { type: String, default: 'General', trim: true },
  publisher: { type: String, default: '', trim: true },
  publishedYear: { type: Number, default: new Date().getFullYear() },
  totalCopies: { type: Number, default: 1, min: 0 },
  availableCopies: { type: Number, default: 1, min: 0 },
  description: { type: String, default: '' },
  coverUrl: { type: String, default: '' }
}, { timestamps: true });
module.exports = mongoose.model('Book', bookSchema);
