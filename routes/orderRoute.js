const express = require("express");
const { verifyToken } = require("../middleware/verifyToken");
const {
  createOrder,
  fetchOrdersByUser,
  fetchSingleOrderByUser,
} = require("../controllers/ordersCtrl");

const router = express.Router();
//  /orders is already added in base path
router.post("/create-new-order", verifyToken, createOrder);
router.get("/get-my-orders", verifyToken, fetchOrdersByUser);
router.get("/get-my-order/:id", verifyToken, fetchSingleOrderByUser);

module.exports = router;
