const express = require('express');
const indexRouter = express.Router();
const path = require('path');

indexRouter.get('/', (req, res) =>
  res.render('index', {
    title: 'Home'
  })
);

module.exports = indexRouter;
