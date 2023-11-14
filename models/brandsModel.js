const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var brandSchema = new mongoose.Schema({
  value: String,
  label: String,
});

//Export the model
module.exports = mongoose.model("Brand", brandSchema);
