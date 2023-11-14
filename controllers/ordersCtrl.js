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
    const resetUrl = `<p>hey ${user.addresses[0].name}<br>
    Thank You For Ordering<br>
    your order is successfully placed <br>
    here is your order id ${doc._id} <br>
    here are the details fo your order<br>
    payment method you have selected is ${doc.paymentMethod}<br>
    total items ${doc.totalItems}
    <p>`;

    const data = {
      to: user.email,
      text: `hey ${user.addresses[0].name} `,
      subject: `order placed successfully `,
      html: resetUrl,
    };

    sendEmail(data);

    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
});

// const deleteOrder = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const order = await Order.findByIdAndDelete(id);
//     res.status(200).json(order);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// };

// const updateOrder = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const order = await Order.findByIdAndUpdate(id, req.body, {
//       new: true,
//     });
//     res.status(200).json(order);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// };

// const fetchAllOrders = async (req, res) => {
//   // sort = {_sort:"price",_order="desc"}
//   // pagination = {_page:1,_limit=10}
//   let query = Order.find({ deleted: { $ne: true } });
//   let totalOrdersQuery = Order.find({ deleted: { $ne: true } });

//   if (req.query._sort && req.query._order) {
//     query = query.sort({ [req.query._sort]: req.query._order });
//   }

//   const totalDocs = await totalOrdersQuery.count().exec();
//   // //console.log({ totalDocs });

//   if (req.query._page && req.query._limit) {
//     const pageSize = req.query._limit;
//     const page = req.query._page;
//     query = query.skip(pageSize * (page - 1)).limit(pageSize);
//   }

//   try {
//     const docs = await query.exec();
//     res.set("X-Total-Count", totalDocs);
//     res.status(200).json(docs);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// };

module.exports = {
  createOrder,
  fetchOrdersByUser,
  fetchSingleOrderByUser,
};
