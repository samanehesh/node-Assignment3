const ClientOps = require('../data/ClientOps');
const Client = require('../models/Client');

const _clientOps = new ClientOps();

exports.Index = async function (req, res) {
  let clients = await _clientOps.getAllClients();
  res.render('client-index', {
    title: 'Clients',
    clients,
    filterText: '',
    errorMessage: ''
  });
};

exports.Index = async function (req, res) {
  const filterText = req.query.filterText ?? '';
  let clients;
  if (filterText) {
    clients = await _clientOps.getFilteredClients(filterText);
  } else {
    clients = await _clientOps.getAllClients();
  }

  res.render('client-index', {
    title: 'Clients',
    clients,
    filterText,
    errorMessage: ''
  });
};

exports.Edit = async function (request, response) {
  const clientId = request.params.id;
  let clientObj = await _clientOps.getClientById(clientId);
  response.render('client-form', {
    title: 'Edit Client',
    errorMessage: '',
    client_id: clientId,
    clientA: clientObj
  });
};

exports.EditClient = async function (request, response) {
  const clientId = request.body.client_id;
  const name = request.body.name;
  const code = request.body.code;
  const company = request.body.company;
  const email = request.body.email;
  // send these to profileOps to update and save the document
  let responseObj = await _clientOps.updateClientById(
    clientId,
    name,
    code,
    company,
    email
  );

  // if no errors, save was successful
  if (responseObj.errorMsg == '') {
    let clients = await _clientOps.getAllClients();
    response.render('client-index', {
      title: 'Clients',
      clients: clients,
      filterText: '',
      errorMessage: ''
    });
  }
  // There are errors. Show form the again with an error message.
  else {
    response.render('client-form', {
      title: 'Edit Client',
      clientA: responseObj.obj,
      client_id: clientId,
      errorMessage: responseObj.errorMsg
    });
  }
};

// Handle profile form GET request
exports.Create = async function (request, response) {
  response.render('client-form', {
    title: 'Create Client',
    errorMessage: '',
    client_id: '',
    clientA: {}
  });
};

// Handle profile form Post request
exports.CreateClient = async function (request, response) {
  let tempClientObj = new Client({
    name: request.body.name,
    code: request.body.code,
    company: request.body.company,
    email: request.body.email
  });

  let responseObj = await _clientOps.createClient(tempClientObj);
  if (responseObj.errorMsg == '') {
    let clients = await _clientOps.getAllClients();
    response.render('client-index', {
      title: 'Clients',
      clients: clients,
      filterText: '',
      errorMessage: ''
    });
  } else {
    response.render('client-form', {
      title: 'Create Profile',
      clientA: responseObj.obj,
      errorMessage: responseObj.errorMsg,
      client_id: ''
    });
  }
};

exports.DeleteClientById = async function (request, response) {
  const clientId = request.params.id;
  let deletedClient = await _clientOps.deleteClientById(clientId);
  let clients = await _clientOps.getAllClients();

  if (deletedClient) {
    response.render('client-index', {
      title: 'Clients',
      clients: clients,
      filterText: '',
      errorMessage: ''
    });
  } else {
    response.render('client-index', {
      title: 'Clients',
      clients: clients,
      errorMessage: 'Error.  Unable to Delete'
    });
  }
};

exports.Detail = async function (request, response) {
  const clientId = request.params.id;
  let client = await _clientOps.getClientById(clientId);
  let clients = await _clientOps.getAllClients();
  if (client) {
    response.render('client-detail', {
      title: 'Clients - ' + client.firstName,
      clientA: client,
      clientId: request.params.id
    });
  } else {
    response.render('client-index', {
      title: 'Clients',
      clients: []
    });
  }
};
