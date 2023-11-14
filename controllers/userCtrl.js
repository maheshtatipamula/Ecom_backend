const Products = require("../models/productModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const { generateToken } = require("../config/jwtToken");
const expressAsyncHandler = require("express-async-handler");
const Product = require;

const createNewUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const email = req.body.email;
  const findUser = await User.findOne({ email });
  if (!findUser) {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    throw new Error("user already exist");
  }
});

//verify a user(login)

const verifyUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const findUser = await User.findOne({ email }).select("password");
  if (!findUser) throw new Error("Invalid Credentials ");

  if (findUser && (await findUser.isPasswordMatched(password))) {
    const token = await generateToken(findUser._id);
    res.cookie("Token", token, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      id: findUser._id,
      // name: findUser.name,
      email: findUser.email,
      // mobile: findUser.mobile,
      token,
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

//get wishlist product

const getAllWishlistProducts = asyncHandler(async (req, res) => {
  const id = req.user._id;
  try {
    const products = await User.findById(id, { wishlist: 1, _id: 0 }).populate(
      "wishlist"
    );
    res.json(products);
  } catch (error) {
    throw new Error(error);
  }
});

// add to wishlist

const addToWishList = asyncHandler(async (req, res) => {
  const id = req.user._id;
  const prodId = req.params.id;

  try {
    const product = await Products.findById(prodId);
    const user = await User.findById(id);
    const isWishlisted = user.wishlist.find(
      (us) => us.toString() === prodId.toString()
    );
    if (isWishlisted) {
      const removeProduct = await User.findByIdAndUpdate(
        id,
        {
          $pull: { wishlist: prodId },
        },
        {
          new: true,
        }
      ).populate("wishlist");

      res.status(200).json({ message: "removed" });
    } else {
      const addProduct = await User.findByIdAndUpdate(
        id,
        {
          $push: { wishlist: prodId },
        },
        {
          new: true,
        }
      ).populate("wishlist");

      res.status(200).json({ message: "added" });
    }
  } catch (error) {
    throw new Error(error);
  }
});

const getOwnProfile = asyncHandler(async (req, res) => {
  const _id = req.user._id;
  try {
    const userP = await User.findById({ _id });

    const userData = userP._doc;

    const { password, ...user } = userData;

    res.json(user);
  } catch (err) {
    res.status(400).json({ message: "user not found" });
  }
});

const updateUserAddress = asyncHandler(async (req, res) => {
  const _id = req.user._id;

  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(400).json({ message: "user not found " });
    }

    const useraddress = await User.findByIdAndUpdate(
      _id,
      {
        $push: { addresses: req.body.addresses },
      },
      {
        new: true,
      }
    );

    return res.status(200).json(useraddress);
  } catch (err) {
    res.status(400).json({ message: `${err}` });
  }
});

const deleteAddress = asyncHandler(async (req, res) => {
  const _id = req.user._id;

  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    const userAdd = user.addresses.findIndex(
      (address) => address.id === req.params.id
    );
    if (userAdd === -1) {
      return res.status(400).json({ message: "Address not found" });
    }
    user.addresses.splice(userAdd, 1);
    const updatedUser = await user.save();
    res.status(200).json({ message: "successfully deleted" });
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
});
const editUserAddress = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const addId = req.params.id;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const addressIndex = user.addresses.findIndex(
      (address) => address.id === addId
    );

    if (addressIndex === -1) {
      return res.status(400).json({ message: "Address not found" });
    }

    user.addresses[addressIndex] = updatedAddress;

    const updatedUser = await user.save();

    return res.status(200).json(updatedUser);
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = {
  createNewUser,
  verifyUser,
  getOwnProfile,
  updateUserAddress,
  addToWishList,
  getAllWishlistProducts,
  deleteAddress,
  editUserAddress,
};
