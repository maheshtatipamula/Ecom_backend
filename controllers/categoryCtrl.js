const expressAsyncHandler = require("express-async-handler");
const Category = require("../models/categoryModel");

const getAllCategories = expressAsyncHandler(async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({ categories });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { getAllCategories };
