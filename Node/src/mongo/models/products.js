const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    title: { type: String, require: true },
    description: { type: String, require: true },
    price: { type: Number, require: true },
    images: {type: [{ type: String, require: true }], default: []},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
  },
  {
    timestamps: true,
  },
);

const model = mongoose.model('Product', productSchema);

module.exports = model;
