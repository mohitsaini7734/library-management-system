const router = require('express').Router();
const Book = require('../models/Book');
const Member = require('../models/Member');
const Transaction = require('../models/Transaction');

router.get('/', async (req, res, next) => {
  try {
    await Transaction.updateMany({ status: 'Issued', dueDate: { $lt: new Date() } }, { $set: { status: 'Overdue' } });
    const [books, members, issued, overdue, returned, totalCopies, availableCopies, recent] = await Promise.all([
      Book.countDocuments(), Member.countDocuments({ active: true }),
      Transaction.countDocuments({ status: { $in: ['Issued', 'Overdue'] } }), Transaction.countDocuments({ status: 'Overdue' }),
      Transaction.countDocuments({ status: 'Returned' }),
      Book.aggregate([{ $group: { _id: null, total: { $sum: '$totalCopies' } } }]),
      Book.aggregate([{ $group: { _id: null, total: { $sum: '$availableCopies' } } }]),
      Transaction.find().populate('book member').sort({ createdAt: -1 }).limit(8)
    ]);
    res.render('dashboard', {
      title: 'Dashboard',
      stats: { books, members, issued, overdue, returned, totalCopies: totalCopies[0]?.total || 0, availableCopies: availableCopies[0]?.total || 0 }
      , recent
    });
  } catch (e) { next(e); }
});

module.exports = router;
