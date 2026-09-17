const router = require('express').Router();
const Member = require('../models/Member');
const Transaction = require('../models/Transaction');

router.get('/', async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    const filter = q ? { $or: [{ name: new RegExp(q, 'i') }, { email: new RegExp(q, 'i') }, { membershipId: new RegExp(q, 'i') }, { phone: new RegExp(q, 'i') }] } : {};
    const members = await Member.find(filter).sort({ createdAt: -1 });
    res.render('members/index', { title: 'Members', members, q });
  } catch (e) { next(e); }
});

router.get('/new', (req, res) => res.render('members/form', { title: 'Add New Member', member: {}, action: '/members', method: 'POST' }));
router.post('/', async (req, res, next) => { try { await Member.create(req.body); res.redirect('/members?success=Member%20added%20successfully'); } catch (e) { next(e); } });

router.get('/:id/edit', async (req, res, next) => { try { const member = await Member.findById(req.params.id); if (!member) return res.redirect('/members'); res.render('members/form', { title: 'Edit Member', member, action: `/members/${member._id}`, method: 'PUT' }); } catch (e) { next(e); } });
router.put('/:id', async (req, res, next) => { try { await Member.findByIdAndUpdate(req.params.id, { ...req.body, active: req.body.active === 'on' }, { runValidators: true }); res.redirect('/members?success=Member%20updated%20successfully'); } catch (e) { next(e); } });
router.delete('/:id', async (req, res, next) => { try { if (await Transaction.exists({ member: req.params.id, status: { $in: ['Issued', 'Overdue'] } })) return res.status(400).render('500', { title: 'Cannot Delete Member', error: { message: 'This member has an active transaction and cannot be deleted.' } }); await Member.findByIdAndDelete(req.params.id); res.redirect('/members?success=Member%20deleted%20successfully'); } catch (e) { next(e); } });
module.exports = router;
