const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
const { Schema } = mongoose;

// const userSchema = new Schema({
const userSchema = Schema({
  
  username: { type: String, require: true, unique: true },
  email:    { type: String, require: true, unique: true },
  password: { type: String, require: true },
  avatar:   { type: String }
  // data: { type: { age: Number, isMale: Boolean } },
  // role: { type: String, enum: ['admin', 'seller'], default: 'seller' },
},{ timestamps: true });

const model = mongoose.model('User', userSchema);

module.exports = model;
