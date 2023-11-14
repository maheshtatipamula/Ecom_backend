const express = require("express");
const { getAllCategories } = require("../controllers/categoryCtrl");
const { verifyToken } = require("../middleware/verifyToken");

const router = express.Router();

router.get("/get-all-categories", verifyToken, getAllCategories);
module.exports = router;
