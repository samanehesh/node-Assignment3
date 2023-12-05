const ProductOps = require('../data/ProductOps');
const Product = require('../models/Product');

const _productOps = new ProductOps();

exports.Index = async function (req, res) {
  const filterText = req.query.filterText ?? '';
  let products;
  if (filterText) {
    products = await _productOps.getFilteredProducts(filterText);
  } else {
    products = await _productOps.getAllProducts();
  }

  res.render('product-index', {
    title: 'Products',
    products,
    filterText,
    errorMessage: ''
  });
};

exports.Detail = async function (req, res) {
  let product = await _productOps.getProductById(req.params.id);
  const productId = req.params.id;
  res.render('product-detail', {
    title: 'Product',
    product,
    productId
  });
};

exports.Create = async function (req, res) {
  res.render('product-form', {
    title: 'Create Product',
    errorMessage: '',
    productId: null,
    product: {}
  });
};

exports.CreateProduct = async function (req, res) {
  //create a product schema object using form data
  let formObj = new Product({
    productId: null,
    name: req.body.name,
    code: req.body.code,
    unit_cost: req.body.unit_cost
  });

  //try to create a product object and add to database
  response = await _productOps.createProduct(formObj);

  // if no errors, it was created and save to db successfully
  if (response.errorMsg == '') {
    let products = await _productOps.getAllProducts();
    res.render('product-index', {
      title: 'Products',
      products,
      filterText: '',
      errorMessage: ''
    });
  }
  // There are errors. Show form the again with an error message.
  else {
    res.render('product-form', {
      title: 'Create Product',
      product: response.obj,
      productId: null,
      errorMessage: response.errorMsg
    });
  }
};

exports.Edit = async function (req, res) {
  const productId = req.params.id;
  const product = await _productOps.getProductById(productId);
  res.render('product-form', {
    title: 'Edit Product',
    errorMessage: '',
    productId,
    product
  });
};

exports.EditProduct = async function (req, res) {
  const productId = req.body.productId;
  const formObj = {
    name: req.body.name,
    code: req.body.code,
    unit_cost: req.body.unit_cost
  };
  //try to create a product object and add to database
  response = await _productOps.updateProductById(productId, formObj);

  // if no errors, it was created and save to db successfully
  if (response.errorMsg == '') {
    let products = await _productOps.getAllProducts();
    res.render('product-index', {
      title: 'Products',
      products,
      filterText: '',
      errorMessage: ''
    });
  }
  // There are errors. Show form the again with an error message.
  else {
    res.render('product-form', {
      title: 'Create Product',
      product: response.obj,
      productId,
      errorMessage: response.errorMsg
    });
  }
};

exports.DeleteProductById = async function (req, res) {
  const productId = req.params.id;
  let deletedProduct = await _productOps.deleteProductById(productId);
  let products = await _productOps.getAllProducts();

  if (deletedProduct) {
    res.render('product-index', {
      title: 'Products',
      products,
      filterText: '',
      errorMessage: ''
    });
  } else {
    res.render('product-index', {
      title: 'Products',
      products,
      filterText: '',
      errorMessage: 'Error.  Unable to Delete'
    });
  }
};
