const Order = require('../model/Order');
const Product = require('../model/Product');
const asyncHandler =require('express-async-handler')

/*
1. New Order
2. Single Order
3. My Orders
4. All Orders -- ADMIN
5. Updated Order Status -- ADMIN
6. Delete Order -- ADMIN
*/

// 1.
const newOrder = asyncHandler(async (req,res,nxt) => {
    const {shippingInfo,orderItems,paymentInfo,itemsPrice,taxPrice,shippingPrice,totalPrice} = req.body

    // creating new order
    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt : Date.now(),
        user : req.user._id
    })

    res.status(201).json({
        success : true,
        message : `Order Has Been Placed`,
        data : order
    })
})


// 2. 
const singleOrder = asyncHandler(async(req,res,nxt) => {
    const order = await Order.findById(req.params.id).populate("user","firstName lastName email");

    if(!order){
        return res.status(404).json({
            success : false,
            error : "Order Not Found"
        })
    }

    res.status(200).json({
        success : true,
        message : "Order Founded",
        data : order
    })
})

// 3.
const myOrder = asyncHandler(async (req,res,nxt) => {
    const order = await Order.find({user : req.user._id})

    res.status(200).json({
        success : true,
        message : "Your Order",
        data : order
    })
})

// 4.
const allOrderADMIN = asyncHandler(async (req,res,nxt) => {
    const order = await Order.find();

    let totalAmount = 0;

    order.forEach((order) => {
        totalAmount += order.totalPrice
    })

    res.status(200).json({
        success : true,
        message : "All Orders",
        data : order.reverse(),
        totalOrder : order.length,
        totalAmount
    })
})

// 5.
const updateStatusADMIN = asyncHandler(async(req,res,nxt) => {
    const order = await Order.findById(req.params.id);

    if(!order){
        return res.status(404).json({
            success : false,
            error : "Order Not Found"
        })
    }

    if(order.orderStatus === "Deliverd"){
        return res.status(400).json({
            success : false,
            error : "Order is Already Deliverd"
        })
    }

    if (req.body.status === "Shipped") {
        order.orderItems.forEach(async (o) => {
          await updateStock(o.product, o.qty);
        });
      }

    order.orderStatus = req.body.status

    if(req.body.status === "Deliverd"){
        order.deliverdAt = Date.now();
    }

    await order.save({validateBeforeSave : false});

    res.status(200).json({
        success : true,
        message : "Order Status Has Updated",
    })
})

async function updateStock(id, quantity) {

    const product = await Product.findById(id.toString());

    product.stock = product.stock - quantity;
  
    await product.save();
  }
  

// 6.
const deleteOrderADMIN = asyncHandler(async (req,res,nxt) => {
    const order = await Order.findById(req.params.id);

    if(!order){
        return res.status(404).json({
            success : false,
            error : "Order Not Found"
        })
    }

    await order.remove();

    res.status(200).json({
        success : true,
        message : "Order Deleted",
    })
}) 

module.exports = {newOrder,singleOrder,myOrder,allOrderADMIN,updateStatusADMIN,deleteOrderADMIN}