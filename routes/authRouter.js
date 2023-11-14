const express = require("express");
const { body } = require("express-validator");
const {
  createNewUser,
  verifyUser,
  updateUserAddress,
  getOwnProfile,
  addToWishList,
  getAllWishlistProducts,
  deleteAddress,
} = require("../controllers/userCtrl");

const { verifyToken } = require("../middleware/verifyToken");

const router = express.Router();

router.post(
  "/register",
  [
    // body("name", "enter a valid name").isLength({ min: 4 }),
    body("email", "enter valid email").isEmail(),
    // body("mobile", "enter valid number").isLength({ min: 10 }),

    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters")
      .matches(/\d/)
      .withMessage("Password must contain at least one digit")
      .matches(/[a-z]/)
      .withMessage("Password must contain at least one lowercase letter")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter")
      .matches(/[!@#$%^&*()\-_=+{};:,<.>]/)
      .withMessage("Password must contain at least one special character"),
  ],
  createNewUser
);
router.post("/login", verifyUser);
router.put("/update", verifyToken, updateUserAddress);
router.patch("/add-to-wishlist/:id", verifyToken, addToWishList);

router.get("/my-profile", verifyToken, getOwnProfile);
router.get("/get-wishlist-products", verifyToken, getAllWishlistProducts);
router.delete("/delete-address/:id", verifyToken, deleteAddress);

module.exports = router;
