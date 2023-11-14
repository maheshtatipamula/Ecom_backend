const Products = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const ApiFeatures = require("../utils/ApiFeatures");

const postProduct = asyncHandler(async (req, res, next) => {
  const newProduct = await Products.create(req.body);

  res.json(newProduct);
});

const getAllProducts = asyncHandler(async (req, res, next) => {
  const features = new ApiFeatures(Products.find(), req.query)
    .filter()
    .filterByCategory()
    .filterByBrands()
    .sort()
    .limitingFields()
    .pagination();

  let products = await features.query;
  const totalDocs = new ApiFeatures(Products.find(), req.query)
    .filter()
    .filterByCategory()
    .filterByBrands();

  const totalDocuments = await totalDocs.query.count().exec();

  res.json({ products, totalDocuments });
});

const getaProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const findProduct = await Products.findById(id);
  if (!findProduct) {
    throw new Error("no product");
  }
  res.json(findProduct);
});

module.exports = { postProduct, getAllProducts, getaProduct };
