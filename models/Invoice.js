const mongoose = require("mongoose");
const {productSchema} = require('./Product');
const {clientSchema} = require('./Client');

const invoiceSchema = mongoose.Schema(
  {
    invoiceNumber: { type: Number, required: true,unique: true,validate: {
      validator: (value) => value > 0, // Ensure positive number
      message: "Invoice number must be a positive number.",
    },},
    issueDate :{type: Date, required: true},
    dueDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > this.issueDate; 
        },
        message: "Due date must be greater than issue date.",
      },
    },
    qty: { type: Array, required: true },
    total : {type : Number},

    client: { type: clientSchema, required: true, allowNull: false },
    products : {type: [productSchema], required: true}

  },
  { collection: "invoices" }
);

// invoiceSchema.add({
//   client: clientSchema
// });

// invoiceSchema.add({
//   products: [productSchema],
// });

const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;
