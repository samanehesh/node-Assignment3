const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String },
    unit_cost: { type: Number, required: true }
  },
  { collection: 'products' }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
