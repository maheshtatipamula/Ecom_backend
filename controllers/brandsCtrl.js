const expressAsyncHandler = require("express-async-handler");
const Brand = require("../models/brandsModel");

const getAllBrands = expressAsyncHandler(async (req, res) => {
  try {
    const brands = await Brand.find();
    res.json({ brands });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { getAllBrands };
