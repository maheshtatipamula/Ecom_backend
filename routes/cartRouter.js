const express = require("express");
const { verifyToken } = require("../middleware/verifyToken");
const {
  addToCart,
  fetchCartByUser,
  deleteFromCart,
  updateCart,
} = require("../controllers/cartCtrl");
const { route } = require("./productRouter");

const router = express.Router();

router.post("/add-to-cart", verifyToken, addToCart);
router.get("/get-all-cart", verifyToken, fetchCartByUser);
router.delete("/delete-cart-item/:id", verifyToken, deleteFromCart);
router.put("/update-cart-item/:id", verifyToken, updateCart);

module.exports = router;
