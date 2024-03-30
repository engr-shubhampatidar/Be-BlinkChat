const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
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
  }
});

userSchema.pre('save', async function (next) {
  try {
    if (this.isModified('password')) {
      const salt = await bcrypt.genSalt(10)
      this.password = await bcrypt.hash(this.password, salt);
    }
  } catch (error) {
    next(error);
  }
})

const User = mongoose.model('User', userSchema);

module.exports = User;
