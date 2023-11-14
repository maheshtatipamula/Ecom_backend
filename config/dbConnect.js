const mongoose = require("mongoose");

const dbConnect = async () => {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("database Connected");
};

module.exports = dbConnect;
