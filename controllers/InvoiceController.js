const InvoiceOps = require('../data/invoiceOps');
const Invoice = require('../models/Invoice');

const _invoiceOps = new InvoiceOps();

exports.Index = async function (req, res) {
  let invoices = await _invoiceOps.getAllInvoices();
  res.render('invoice-index', {
    title: 'Invoices',
    invoices,
    filterText: '',
    errorMessage: ''
  });
};

exports.Index = async function (req, res) {
  const filterText = req.query.filterText ?? '';
  let invoices;
  if (filterText) {
    invoices = await _invoiceOps.getFilteredInvoices(filterText);
  } else {
    invoices = await _invoiceOps.getAllInvoices();
  }

  res.render('invoice-index', {
    title: 'Invoices',
    invoices,
    filterText,
    errorMessage: ''
  });
};

exports.Edit = async function (request, response) {
  const invoiceId = request.params.id;
  let invoiceObj = await _invoiceOps.getInvoiceById(invoiceId);
  response.render('invoice-form', {
    title: 'Edit Invoice',
    errorMessage: '',
    invoice_id: invoiceId,
    invoice: invoiceObj
  });
};

exports.EditInvoice = async function (request, response) {
  const invoiceId = request.body.invoice_id;
  const name = request.body.name;
  const code = request.body.code;
  const company = request.body.company;
  const email = request.body.email;
  // send these to profileOps to update and save the document
  let responseObj = await _invoiceOps.updateInvoiceById(
    invoiceId,
    name,
    code,
    company,
    email
  );

  // if no errors, save was successful
  if (responseObj.errorMsg == '') {
    let invoices = await _invoiceOps.getAllInvoices();
    response.render('invoice-index', {
      title: 'Invoices',
      invoices: invoices,
      filterText: '',
      errorMessage: ''
    });
  }
  // There are errors. Show form the again with an error message.
  else {
    response.render('invoice-form', {
      title: 'Edit Invoice',
      invoice: responseObj.obj,
      invoice_id: invoiceId,
      errorMessage: responseObj.errorMsg
    });
  }
};

// Handle profile form GET request
exports.Create = async function (request, response) {
  response.render('invoice-form', {
    title: 'Create Invoice',
    errorMessage: '',
    invoice_id: '',
    invoice: {}
  });
};

// Handle profile form Post request
exports.CreateInvoice = async function (request, response) {
  let tempInvoiceObj = new Invoice({
    name: request.body.name,
    code: request.body.code,
    company: request.body.company,
    email: request.body.email
  });

  let responseObj = await _invoiceOps.createInvoice(tempInvoiceObj);
  if (responseObj.errorMsg == '') {
    console.log("aaa")
    let invoices = await _invoiceOps.getAllInvoices();
    response.render('invoice-index', {
      title: 'Invoices',
      invoices: invoices,
      filterText: '',
      errorMessage: ''
    });
  } else {
    response.render('invoice-form', {
      title: 'Create Invoice',
      clientA: responseObj.obj,
      errorMessage: responseObj.errorMsg,
      invoice_id: ''
    });
  }
};

exports.DeleteInvoiceById = async function (request, response) {
  const invoiceId = request.params.id;
  let deletedInvoice = await _invoiceOps.deleteInvoiceById(invoiceId);
  let invoices = await _invoiceOps.getAllInvoices();

  if (deletedInvoice) {
    response.render('invoice-index', {
      title: 'Invoices',
      invoices: invoices,
      filterText: '',
      errorMessage: ''
    });
  } else {
    response.render('invoice-index', {
      title: 'Invoices',
      invoices: invoices,
      errorMessage: 'Error.  Unable to Delete'
    });
  }
};

exports.Detail = async function (request, response) {
  const invoiceId = request.params.id;
  let invoice = await _invoiceOps.getInvoiceById(invoiceId)
  let invoices = await _invoiceOps.getAllInvoices();
  if (invoice) {
    response.render('invoice-detail', {
      title: 'Invoices',
      invoice: invoice,
      invoiceId: request.params.id
    });
  } else {
    response.render('invoice-index', {
      title: 'Invoices',
      clients: []
    });
  }
};
