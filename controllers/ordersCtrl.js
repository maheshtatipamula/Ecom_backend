const Products = require("../models/productModel");
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const asyncHandler = require("express-async-handler");
const sendEmail = require("./emailCtrl");

const fetchOrdersByUser = async (req, res) => {
  const { id } = req.user;
  try {
    const orders = await Order.find({ user: id });

    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json(err);
  }
};

const fetchSingleOrderByUser = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const orderId = req.params.id;

  try {
    const orders = await Order.findOne({ _id: orderId });
    if (orders) {
      if (id !== orders.user.toString()) {
        return res.status(402).json({
          message: "Unauthorized - You can only fetch your own order details",
        });
      }
      res.status(200).json(orders);
    } else {
      res.status(400).json({ message: "cannot find the order" });
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

const createOrder = asyncHandler(async (req, res) => {
  const order = new Order(req.body);
  // here we have to update stocks;

  for (let item of order.items) {
    let product = await Products.findOne({ _id: item.product.id });
    product.$inc("stock", -1 * item.quantity);
    // for optimum performance we should make inventory outside of product.
    await product.save();
  }
  try {
    const doc = await order.save();
    const user = await User.findById(order.user);
    // we can use await for this also
    // sendMail({
    //   to: user.email,
    //   html: invoiceTemplate(order),
    //   subject: "Order Received",
    // });
    console.log(doc);
    const resetUrl = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
    
        header {
          background-color: #333;
          color: #fff;
          text-align: center;
          padding: 1em;
        }
    
        main {
          max-width: 800px;
          margin: 20px auto;
          padding: 20px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
    h1{
      color:#fff;
    }
       h2 {
          color: #111;
        }
    
        p {
          color: #333;
        }
    
        ol {
          list-style-type: none;
          padding: 0;
        }
    
        li {
          margin-bottom: 20px;
          padding: 10px;
          background-color: #f9f9f9;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
    
        strong {
          color: #333;
        }
    
        img {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
          margin-top: 10px;
        }
      </style>
    </head>
    <body>
    
      <header>
        <h1>Order Confirmation</h1>
      </header>
    
      <main>
        <p>Hey ${doc.selectAddress.name},</p>
        <p>Thank you for your order! Your order has been successfully placed.</p>
        
        <h2>Order Details</h2>
        <p>Order ID: ${doc._id}</p>
        <p>Payment Method: ${doc.paymentMethod}</p>
        <p>Total Items: ${doc.totalItems}</p>
        <p>Total Amount: ${doc.totalAmount}</p>
    
      
    
        <p>Thank you for shopping with us!</p>
      </main>
    
    </body>
    </html>`;

    const data = {
      to: user.email,
      text: `hey ${doc.selectAddress.name} `,
      subject: `order placed successfully `,
      html: resetUrl,
    };

    sendEmail(data);

    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = {
  createOrder,
  fetchOrdersByUser,
  fetchSingleOrderByUser,
};
