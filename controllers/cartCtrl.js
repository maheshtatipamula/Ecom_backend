const Cart = require("../models/cartModel");

const fetchCartByUser = async (req, res) => {
  const userId = req.id;

  try {
    const cartItems = await Cart.find({ user: userId }).populate("product");

    res.status(200).json(cartItems);
  } catch (err) {
    res.status(400).json(err);
  }
};

const addToCart = async (req, res) => {
  const user = req.id;
  const { quantity, prodId } = req.body;

  try {
    const isCart = await Cart.findOne({ user, product: prodId });

    if (isCart) {
      return res.status(400).json({ message: "cart Item already exists" });
    }
    const cartAdded = await Cart.create({
      quantity,
      product: prodId,
      user,
    });
    const populatedcart = await cartAdded.populate("product");

    res.status(201).json(populatedcart);
  } catch (err) {
    res.status(400).json(err);
  }
};

const deleteFromCart = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await Cart.findByIdAndDelete(id);
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

const updateCart = async (req, res) => {
  const { id } = req.params;

  try {
    const cart = await Cart.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    const result = await cart.populate("product");

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports = {
  fetchCartByUser,
  addToCart,
  deleteFromCart,
  updateCart,
};
