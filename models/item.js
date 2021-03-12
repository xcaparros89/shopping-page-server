const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  title: String,
  description: String,
  price: Number,
  discount: {type:Number, default:0},
  img: String,
  tags: [String],
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;