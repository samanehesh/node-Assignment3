const express = require('express');
const invoiceRouter = express.Router();
const invoiceController = require('../controllers/InvoiceController');

invoiceRouter.get('/', invoiceController.Index);

invoiceRouter.get('/edit', invoiceController.Create);
invoiceRouter.post('/edit', invoiceController.CreateInvoice);
invoiceRouter.get('/:id', invoiceController.Detail);

invoiceRouter.get('/:id/delete', invoiceController.DeleteInvoiceById);

invoiceRouter.get('/edit/:id', invoiceController.Edit);
invoiceRouter.post('/edit/:id', invoiceController.EditInvoice);

module.exports = invoiceRouter;
