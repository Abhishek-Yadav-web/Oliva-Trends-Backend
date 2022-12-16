const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.ObjectId,
        required : true
    },
    products : [
        {
            type : Object,
            required : true
        }
    ]
})

const wishlistModel = new mongoose.model("wishlist",wishlistSchema)

module.exports = wishlistModel