const Product = require('../model/Product');
const asyncHandler = require('express-async-handler');
const Wishlist = require('../model/Wishlist')

//controller
/*
1. create product
2. get all product
3. update product -- ADMIN
4. delete product -- ADMIN
5. single product details
*/

// 1.
const createProduct = asyncHandler(async(req,res,nxt) => {
    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    // 
    res.status(200).json({
        success : true,
        message : "Product created, Successfully"
    })
})

// 2.
const getAllProduct = asyncHandler(async(req,res,nxt) => {

    let products = [];
    const {strPrice,endPrice,name} = req.query
        
        if(strPrice || endPrice){
            const start = strPrice ? strPrice : 0;
            const end = endPrice ? endPrice : 99999999;
            products = await Product.find({price : {$gte : start , $lte : end}})
        }

        if(name){
            let temp = []
            products = await Product.find();
            products.filter((e) => {
                if(e.name.search(name) !== -1){
                    temp.push(e)
                }
            })
            products = temp
        }

        if(!name && !strPrice && !endPrice){
            products = await Product.find(req.query)
        }

        


    //get data by queris
    res.status(200).json({
        success : true,
        message : "All Product",
        data : products.reverse(),
        totalProducts : products.length
    })
       
    
})

// 3.
const updateProduct = asyncHandler(async(req,res,nxt) => {

    let product = await Product.findById(req.params.id)

    if(!product){
        return res.status(404).json({success : false, error : "Product Not Found"})
    }

    product = await Product.findByIdAndUpdate(req.params.id,req.body);

    res.status(200).json({
        success : true,
        message : "product updateded"
    })

})

// 4.
const deleteProduct = asyncHandler(async(req,res,nxt) => {
    const product = await Product.findById(req.params.id);

    if(!product){
        return res.status(404).json({success : false, error : "Product Not Found"})
    }

    await product.remove();

    res.status(200).json({
        success : true,
        message : "product deleted"
    })

})

// 5.
const productDetails = asyncHandler(async(req,res,next) => {
    const product = await Product.findById(req.params.id);

    if(!product){
        return res.status(404).json({success : false, error : "Product Not Found"})
    }

    res.status(200).json({
        success : true,
        message : "product found!",
        data : product
    })

})

module.exports = {createProduct,getAllProduct,updateProduct,deleteProduct,productDetails}