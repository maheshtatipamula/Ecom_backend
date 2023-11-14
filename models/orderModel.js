const mongoose = require("mongoose"); // Erase if already required
const paymentMethods = ["card", "cash"];
// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema(
  {
    items: { type: [mongoose.Schema.Types.Mixed], required: true },
    totalAmount: { type: Number },
    totalItems: { type: Number },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    paymentMethod: { type: String, required: true, enum: paymentMethods },
    paymentStatus: { type: String, default: "pending" },
    status: { type: String, default: "pending" },
    selectAddress: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Order", orderSchema);
