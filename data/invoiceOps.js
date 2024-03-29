const Invoice = require("../models/Invoice.js");

class InvoiceOps {
  InvoiceOps() {}

  async getAllInvoices() {
    const invoices = await Invoice.find({}).sort({ invoiceNumber: 1 });
    return invoices;
  }

  async createInvoice(invoiceObj) {
    try { 
      const error = await invoiceObj.validateSync();
      if (error) {
        const response = {
          obj: invoiceObj,
          errorMsg: error.message,
        };
        return response; // Exit if the model is invalid
      }
      // Model is valid, so save it
      const result = await invoiceObj.save();
      const response = {
        obj: result,
        errorMsg: "",
      };
      return response;
    } catch (error) {
      const response = {
        obj: invoiceObj,
        errorMsg: error.message,
      };
      return response;
    }
  }

  async deleteInvoiceById(id) {
    let result = await Invoice.findByIdAndDelete(id);
    return result;
  }

  async getInvoiceById(id) {
    let invoice = await Invoice.findById(id);
    return invoice;
  }

//   async getFilteredInvoices(filterText) {
//     let result = await Invoice.find({
//       invoiceNumber: { $regex: `.*${filterText}.*`, $options: 'i' }
//     });
//     return result;
//   }

async getFilteredInvoices(filterText) {
  const filterNumber = parseFloat(filterText);

  if (!isNaN(filterNumber)) {
    const result = await Invoice.find({
      invoiceNumber: filterNumber
    });

    return result;
  } else {
    console.error('Invalid filterText: Not a number');
    return []; 
  }
}


}

module.exports = InvoiceOps;
