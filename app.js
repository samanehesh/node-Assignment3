'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const indexRouter = require('./routers/indexRouter');
const productRouter = require('./routers/productRouter');
const clientRouter = require('./routers/clientRouter');
const logger = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const { mongoose } = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3003;

//set up database
const uri = process.env.MONGO_CONNECTION_STRING;
mongoose.connect(uri);
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//set request body to be parsed in json format
app.use(bodyParser());

//tell Express where to find our templates (views) and set the view engine to ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//find static files from public folder
app.use(express.static(__dirname + '/public'));

//log request using dev template from morgan package
app.use(logger('dev'));

// Enable layouts and set the default layout
app.use(expressLayouts);
app.set('layout', './layouts/full-width');

//set up routers
app.use('/', indexRouter);
app.use('/products', productRouter);
app.use('/clients', clientRouter);

//the catch all error page
app.all('/*', (req, res) => {
  res.status(404).send('This page does not exist!');
});

//close db connection on shut down of the app
process.on('SIGTERM', () => {
  db.close();
});

app.listen(port, () => console.log(`app listening on port ${port}!`));
