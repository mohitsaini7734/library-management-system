const router = require('express').Router();
const Book = require('../models/Book');
const Transaction = require('../models/Transaction');

router.get('/', async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    const category = (req.query.category || '').trim();
    const filter = {};
    if (q) filter.$or = [{ title: new RegExp(q, 'i') }, { author: new RegExp(q, 'i') }, { isbn: new RegExp(q, 'i') }, { publisher: new RegExp(q, 'i') }];
    if (category) filter.category = category;
    const [books, categories] = await Promise.all([
      Book.find(filter).sort({ createdAt: -1 }), Book.distinct('category')
    ]);
    res.render('books/index', { title: 'Books', books, q, category, categories: categories.filter(Boolean).sort() });
  } catch (e) { next(e); }
});

router.get('/new', (req, res) => res.render('books/form', { title: 'Add New Book', book: {}, action: '/books', method: 'POST' }));

router.post('/', async (req, res, next) => {
  try {
    const total = Math.max(1, Number(req.body.totalCopies) || 1);
    await Book.create({ ...req.body, totalCopies: total, availableCopies: total, publishedYear: Number(req.body.publishedYear) || new Date().getFullYear() });
    res.redirect('/books?success=Book%20added%20successfully');
  } catch (e) { next(e); }
});

router.get('/:id/edit', async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.redirect('/books');
    res.render('books/form', { title: 'Edit Book', book, action: `/books/${book._id}`, method: 'PUT' });
  } catch (e) { next(e); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.redirect('/books');
    const newTotal = Math.max(1, Number(req.body.totalCopies) || 1);
    const issued = book.totalCopies - book.availableCopies;
    if (newTotal < issued) return res.status(400).render('500', { title: 'Cannot Update Book', error: { message: `Total copies cannot be less than the ${issued} copy/copies currently issued.` } });
    Object.assign(book, { title: req.body.title, author: req.body.author, isbn: req.body.isbn, category: req.body.category, publisher: req.body.publisher, publishedYear: Number(req.body.publishedYear) || new Date().getFullYear(), totalCopies: newTotal, availableCopies: newTotal - issued, description: req.body.description, coverUrl: req.body.coverUrl });
    await book.save();
    res.redirect('/books?success=Book%20updated%20successfully');
  } catch (e) { next(e); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    if (await Transaction.exists({ book: req.params.id, status: { $in: ['Issued', 'Overdue'] } })) return res.status(400).render('500', { title: 'Cannot Delete Book', error: { message: 'This book has an active transaction and cannot be deleted.' } });
    await Book.findByIdAndDelete(req.params.id);
    res.redirect('/books?success=Book%20deleted%20successfully');
  } catch (e) { next(e); }
});

module.exports = router;
