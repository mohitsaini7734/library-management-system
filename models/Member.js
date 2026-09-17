const mongoose = require('mongoose');
const memberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, default: '', trim: true },
  address: { type: String, default: '', trim: true },
  membershipId: { type: String, unique: true, trim: true },
  joinedAt: { type: Date, default: Date.now },
  active: { type: Boolean, default: true }
}, { timestamps: true });
memberSchema.pre('validate', function(next) { if (!this.membershipId) this.membershipId = `MEM-${Date.now()}-${Math.floor(Math.random()*1000)}`; next(); });
module.exports = mongoose.model('Member', memberSchema);
