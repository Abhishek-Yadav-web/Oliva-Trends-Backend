const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, "Please Enter Product Name"],
        lowercase : true
    },
    description : {
        type : String,
        required : [true, "Please Enter Product Description"]
    },
    price : {
        type : Number,
        required : [true, "Please Enter Product Price"],
        maxlength : [8, "Price cannnot exceed more then 8 digit"]
    },
    images : [
        {
            public_id : {
                type : String,
                required : true
            },
            url : {
                type : String,
                required : true
            }
        }
    ],
    category : {
        type :  String,
        required : [true, "Please Enter Product Category"]
    },
    stock : {
        type :  Number,
        required : [true, "Plesae Enter Product Stock"],
        maxlength : [5, "Product Stock Cannot Exceed More Then 5"],
        default : 1
    },
    size : [
        {
            type : String
        }
    ],
    gender : {
        type : String,
        required : [true, "Please Enter Gender"],
        lowercase : true
    },
    wear : {
        type : String,
        required : [true, "please Enter Wear Type"],
        lowercase : true
    },
    brand : {
        type : String,
        required : [true , "Please Enter Product Brand"],
        default : "ajio-trends",
        lowercase : true
    },
    user : {
        type : mongoose.Schema.ObjectId,
        ref : "User",
        required : true
    }

})

module.exports = new mongoose.model("Product", productSchema);