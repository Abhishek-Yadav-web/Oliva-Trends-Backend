const Wishlist = require('../model/Wishlist');
const Product = require('../model/Product')
const asynsHandler = require('express-async-handler')


const addInWishlist = asynsHandler(async (req,res,nxt) => {
    const id = req.params.id

    const product = await Product.findById(id) 

    if(!product){
        return res.status(400).json({
            success : false,
            addInWishlist : false,
            error : "Product Not Found"
        })
    }

    const user = await Wishlist.findOne({userId : req.user.id})

    if(!user){
        await Wishlist.create({
            userId : req.user.id,
            product : [product]
        })
    }else{
        const alreadyProduct = await Wishlist.findOne({products : [product]})
        if(!alreadyProduct){
            await Wishlist.findOneAndUpdate({userId : req.user.id},{$push : {products : product}})
        }else{
            return res.status(400).json({
                success : false,
                addInWishlist : false,
                error : "Product Already In Wishlist"
            })
        }
    }

    res.status(200).json({
        success : true,
        addInWishlist : true,
        message : "Added In Wishlist"
    })

})

const removeFromWishlist = asynsHandler(async (req,res,nxt) => {
    const id = req.params.id

    const product = await Product.findById(id);

    const productRemove = await Wishlist.findOneAndUpdate({userId : req.user.id},{$pull : {products : product}})

    if(!productRemove){
        return res.status(400).json({
            success : false,
            removeFromWishlist : false,
            error : "Product Already Removed From Wishlist"
        })
    }

    res.status(200).json({
        success : true,
        removeFromWishlist : true,
        message : "Product Removed From Whislist"
    })

})

const getProductFromWishlist = asynsHandler(async (req,res,nxt) => {
    const products = await Wishlist.findOne({userId : req.user.id})

    if(!products){
        return res.status(400).json({
            success : false,
            error : "Internal Server Error",
        })
    }

    res.status(200).json({
        success : true,
        message : "All Products From Wishlist",
        products,
        productsLength : products.products.length
    })

})

const checkInWishlist = asynsHandler(async (req,res,nxt) => {
    const id = req.params.id

    const product = await Product.findById(id);

    if(!product){
        return res.status(400).json({
            success : false,
            error : "Product Not Found : Invalid Id",
        })
    }

    const isProductIn = await Wishlist.findOne({userId : req.user.id, products : {$in : product}})

    res.status(200).json({
        success : true,
        message : "Finding this product in wishlist",
        inWishlist : isProductIn ? true : false
    })
})

module.exports = {addInWishlist,removeFromWishlist,getProductFromWishlist,checkInWishlist}