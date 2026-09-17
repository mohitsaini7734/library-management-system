const router = require('express').Router();
const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
const Member = require('../models/Member');

const refreshOverdue = async () => Transaction.updateMany({ status: 'Issued', dueDate: { $lt: new Date() } }, { $set: { status: 'Overdue' } });

router.get('/', async (req, res, next) => {
  try {
    await refreshOverdue();
    const status = ['Issued', 'Overdue', 'Returned'].includes(req.query.status) ? req.query.status : '';
    const filter = status ? { status } : {};
    const transactions = await Transaction.find(filter).populate('book member').sort({ createdAt: -1 });
    res.render('transactions/index', { title: 'Transactions', transactions, status });
  } catch (e) { next(e); }
});

router.get('/new', async (req, res, next) => {
  try {
    const [books, members] = await Promise.all([Book.find({ availableCopies: { $gt: 0 } }).sort({ title: 1 }), Member.find({ active: true }).sort({ name: 1 })]);
    res.render('transactions/new', { title: 'Issue Book', books, members });
  } catch (e) { next(e); }
});

router.post('/issue', async (req, res, next) => {
  try {
    const { bookId, memberId, dueDate } = req.body;
    const due = new Date(dueDate);
    if (!bookId || !memberId || Number.isNaN(due.getTime()) || due <= new Date()) return res.status(400).render('500', { title: 'Invalid Issue Request', error: { message: 'Select a book, active member and a future due date.' } });
    const [book, member] = await Promise.all([Book.findById(bookId), Member.findById(memberId)]);
    if (!book || book.availableCopies < 1) return res.status(400).render('500', { title: 'Book Unavailable', error: { message: 'The selected book has no available copies.' } });
    if (!member || !member.active) return res.status(400).render('500', { title: 'Member Inactive', error: { message: 'The selected member is not active.' } });
    const existing = await Transaction.exists({ book: bookId, member: memberId, status: { $in: ['Issued', 'Overdue'] } });
    if (existing) return res.status(400).render('500', { title: 'Already Issued', error: { message: 'This member already has an active issue for this book.' } });
    await Transaction.create({ book: bookId, member: memberId, dueDate: due });
    book.availableCopies -= 1;
    await book.save();
    res.redirect('/transactions?success=Book%20issued%20successfully');
  } catch (e) { next(e); }
});

router.put('/:id/return', async (req, res, next) => {
  try {
    const t = await Transaction.findById(req.params.id);
    if (!t || t.returnDate) return res.redirect('/transactions');
    const now = new Date();
    const late = Math.max(0, Math.ceil((now - t.dueDate) / 86400000));
    t.returnDate = now; t.status = 'Returned'; t.fine = late * 5;
    await t.save();
    await Book.findByIdAndUpdate(t.book, { $inc: { availableCopies: 1 } });
    res.redirect('/transactions?success=Book%20returned%20successfully');
  } catch (e) { next(e); }
});

module.exports = router;
