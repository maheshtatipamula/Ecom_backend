const jwt = require("jsonwebtoken");

const generateToken = async (id) => {
  return await jwt.sign({ id }, process.env.JWT_SECRET_TOKEN, {
    expiresIn: "1d",
  });
};

module.exports = { generateToken };
