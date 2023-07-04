const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
require("./db.js");
require("dotenv/config");
require('express-async-errors');
const userRoutes = require("./Routes/userRoutes.js");
const productRoutes = require("./Routes/productRoutes.js");
const categoryRoutes = require("./Routes/orderRoutes.js");
const orderRoutes = require("./Routes/orderRoutes.js");
const reviewRoutes = require("./Routes/reviewRoutes.js");

app.use(cors());
app.options("*", cors());

//////////////MiddleWares////////////////
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

//////////////Routes////////////////
app.use("/users", userRoutes);


 app.use("/products", productRoutes);
 app.use("/categories",  categoryRoutes);
 app.use("/orders",  orderRoutes);
 app.use("/review", reviewRoutes);



 app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
      staus: statusCode,
      message: err.message || 'internal server error',
      errors: err.errors || []
  })

})




app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

// Add console logs to identify potential issues
console.log("Server code executed");
