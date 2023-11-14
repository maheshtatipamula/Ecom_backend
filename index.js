const express = require("express");
const cors = require("cors");
const path = require("path");
const dbConnect = require("./config/dbConnect");
const productRouter = require("./routes/productRouter");
const authRouter = require("./routes/authRouter");
const categoryRouter = require("./routes/categoryRoute");
const brandRouter = require("./routes/brandRouter");
const cartRouter = require("./routes/cartRouter");
const orderRouter = require("./routes/orderRoute");
const cookieParser = require("cookie-parser");
const { notFound, errorHandler } = require("./middleware/ErrorHandler");
require("dotenv").config();

const app = express();
app.use(cookieParser());

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "*",
  })
);

const port = process.env.PORT || 8006;

dbConnect();
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.use("/api/products/", productRouter);
app.use("/api/user/", authRouter);
app.use("/api/category/", categoryRouter);
app.use("/api/brands/", brandRouter);
app.use("/api/cart/", cartRouter);

app.use("/api/orders", orderRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
