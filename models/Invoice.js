const mongoose = require("mongoose");

const invoiceSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    company : { type: String, required: true },
    email : {type: String, required: true}
  },
  { collection: "invoices" }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;
