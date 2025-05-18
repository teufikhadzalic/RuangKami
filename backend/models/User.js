const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['pemimpin', 'pemimpin_divisi', 'anggota_divisi'],
    required: true
  },
  division: {
    type: String,
    enum: ['art', 'sports', 'academics', null],
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Validate that pemimpin doesn't have a division
UserSchema.pre('validate', function(next) {
  if (this.role === 'pemimpin' && this.division !== null) {
    this.invalidate('division', 'Pemimpin should not have a division');
  }
  
  if ((this.role === 'pemimpin_divisi' || this.role === 'anggota_divisi') && !this.division) {
    this.invalidate('division', 'Division leaders and members must have a division');
  }
  
  next();
});

module.exports = mongoose.model('User', UserSchema);