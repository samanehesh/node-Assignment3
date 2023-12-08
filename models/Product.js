const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String },
    unit_cost: { type: Number, required: true ,validate: {
      validator: (value) => value > 0, // Ensure positive number
      message: "Invoice number must be a positive number."}
    },},

  { collection: 'products' }
);

const Product = mongoose.model('Product', productSchema);

module.exports = {Product,productSchema};
