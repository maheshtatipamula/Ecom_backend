const express = require("express");
const { verifyToken } = require("../middleware/verifyToken");
const {
  getAllProducts,
  postProduct,
  getaProduct,
} = require("../controllers/productCtrl");

const router = express.Router();

router.get("/get-all-products", verifyToken, getAllProducts);
router.get("/get-a-product/:id", verifyToken, getaProduct);
router.post("/post-product", verifyToken, postProduct);

module.exports = router;
