const InvoiceOps = require('../data/invoiceOps');
const Invoice = require('../models/Invoice');
const ProductOps = require("../data/productOps");
const ClientOps = require('../data/clientOps');

const _clientOps = new ClientOps();
const _invoiceOps = new InvoiceOps();
const _productOps = new ProductOps();

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

// Handle profile form GET request
exports.Create = async function (request, response) {
  let clients = await _clientOps.getAllClients();
  let products = await _productOps.getAllProducts();
  response.render('invoice-form', {
    title: 'Create Invoice',
    errorMessage: '',
    invoice_id: '',
    invoice: {},
    clients : clients,
    products : products
  });
};

// Handle profile form Post request
exports.CreateInvoice = async function (request, response) {
  let products = await _productOps.getAllProducts();
  const pIds = request.body.productId;
  const qtys = request.body.qty;  

  // const pIds = request.body['productId[]'];
  // const qtys = request.body['qty[]'];
  // const count = pIds.length;
  let pArray = [];
  let qArray = [];
  for (let i=1; i<2 ; i++){
   
    // const qty = request.body[qname];
    let product = await _productOps.getProductById(pIds);
  
    pArray.push(product);
    qArray.push(qtys);
  }

  let total =0;

  for (let i = 0; i< pArray.length; i++){
    if(pArray[i] && qArray[i]){
      total = total + pArray[i].unit_cost*qArray[i]
    }
  }

  const clientId = request.body.client;
  let client = await _clientOps.getClientById(clientId);
  let clients = await _clientOps.getAllClients();

  let tempInvoiceObj = new Invoice({
    invoiceNumber: request.body.invoiceNumber,
    issueDate: request.body.issueDate,
    dueDate: request.body.dueDate,
    client : client,
    products : pArray,
    qty : qArray,
    total : total
  });

  let responseObj = await _invoiceOps.createInvoice(tempInvoiceObj);
  if (responseObj.errorMsg == '') {
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
      invoice:responseObj.obj,
      errorMessage: responseObj.errorMsg,
      invoice_id: '',
      clients : clients,
      products : products,
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

  if (invoice && invoice.client && invoice.products) {
    response.render('invoice-print', {
      title: 'Invoices',
      invoice: invoice,
      invoiceId: request.params.id,
      clientA : invoice.client,
      productArray: invoice.products,
      qtyArray : invoice.qty,
      total : invoice.total
    });
  } else {
    response.render('invoice-index', {
      title: 'Invoices',
      invoices: invoices,
      errorMessage : "Error creating invoice",
      filterText : ''
    });
  }
};

// exports.Edit = async function (request, response) {
//   const invoiceId = request.params.id;
//   let invoiceObj = await _invoiceOps.getInvoiceById(invoiceId);
//   response.render('invoice-form', {
//     title: 'Edit Invoice',
//     errorMessage: '',
//     invoice_id: invoiceId,
//     invoice: invoiceObj
//   });
// };

// exports.EditInvoice = async function (request, response) {
//   const invoiceId = request.body.invoice_id;
//   const name = request.body.name;
//   const code = request.body.code;
//   const company = request.body.company;
//   const email = request.body.email;
//   // send these to profileOps to update and save the document
//   let responseObj = await _invoiceOps.updateInvoiceById(
//     invoiceId,
//     name,
//     code,
//     company,
//     email
//   );

//   // if no errors, save was successful
//   if (responseObj.errorMsg == '') {
//     let invoices = await _invoiceOps.getAllInvoices();
//     response.render('invoice-index', {
//       title: 'Invoices',
//       invoices: invoices,
//       filterText: '',
//       errorMessage: ''
//     });
//   }
//   // There are errors. Show form the again with an error message.
//   else {
//     response.render('invoice-form', {
//       title: 'Edit Invoice',
//       invoice: responseObj.obj,
//       invoice_id: invoiceId,
//       errorMessage: responseObj.errorMsg
//     });
//   }
// };
