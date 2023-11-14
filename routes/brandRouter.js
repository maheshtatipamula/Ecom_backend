const express = require("express");
const { getAllBrands } = require("../controllers/brandsCtrl");
const { verifyToken } = require("../middleware/verifyToken");

const router = express.Router();

router.get("/get-all-brands", verifyToken, getAllBrands);

module.exports = router;
