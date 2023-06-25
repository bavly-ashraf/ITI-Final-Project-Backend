const express=require('express');
const app=express();
const port=3000;
const cors = require('cors');
require('./db.js');
require('dotenv/config');


// require('express-async-errors');
// const userRoutes=require('./Routes/userRoutes.js');

const userRoutes=require('./Routes/userRoutes.js');
const productRoutes = require('./Routes/productRoutes.js');
const categoryRoutes = require('./Routes/categoryRoutes.js');
// const orderRoutes = require('./Routes/orderRoutes.js');


app.use(cors());
app.options('*', cors())


//////////////MiddleWares////////////////
app.use(express.json());
app.use(express.urlencoded());
const tokenAuth=require('./Helpers/tokenAuth.js'); //for token authentication before loggin


//////////////Routes////////////////
app.use('/users',userRoutes);
app.use('/products', productRoutes);
app.use('/categories',tokenAuth, categoryRoutes);
// app.use('/orders', tokenAuth, orderRoutes);


app.use((err,req,res,next)=>{
	const statusCode = err.statusCode || 500;
	res.status(statusCode).send({
		status:statusCode,
		message: err?.message || 'internal server error',
		errors: err?.errors || []
	})
})

app.listen(port,()=>{
    console.log(`listening on port ${port}`);
})
