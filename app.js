const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload')

// config & use
app.use(bodyParser.urlencoded({extended : false}));
app.use(cookieParser());
app.use(express.json());
app.use(cors())
app.use(fileUpload())

dotenv.config({path : "./config/config.env"});




// routers import & use
const homeRouter = require('./router/home');
const productRouter = require('./router/product');
const userRouter = require('./router/user');
const orderRouter = require('./router/order');
const wishlistRouter = require('./router/wishlist');
const paymentRouter = require('./router/payment');

app.use(homeRouter);
app.use('/api/v1',productRouter);
app.use('/api/v1',userRouter);
app.use('/api/v1',orderRouter);
app.use('/api/v1',wishlistRouter);
app.use('/api/v1',paymentRouter);

// export app
module.exports = app