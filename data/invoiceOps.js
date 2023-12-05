const Invoice = require("../models/Invoice");

class InvoiceOps {
  InvoiceOps() {}

  async getAllInvoices() {
    const invoices = await Invoice.find({}).sort({ name: 1 });
    return invoices;
  }

  async updateInvoiceById(id, name, code,company,email) {
    const invoiceObj = await Invoice.findById(id);
    
    invoiceObj.name = name;
    invoiceObj.code = code;
    invoiceObj.company = company;
    invoiceObj.email = email;
    try {
      const error = await invoiceObj.validateSync();
      if (error) {
        const response = {
          obj: invoiceObj,
          errorMsg: error.message,
        };
        return response; 
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

  async getFilteredInvoices(filterText) {
    let result = await Invoice.find({
      name: { $regex: `.*${filterText}.*`, $options: 'i' }
    });
    return result;
  }


}

module.exports = InvoiceOps;
