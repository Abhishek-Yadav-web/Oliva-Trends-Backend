const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : [true, "Please Enter Your Fisrt Name"],
        maxlength : [12 , "First Name Cannot More Then 12 Char."],
        minlength : [3, "First Name Must Have 3 Char"]
    },
    lastName : {
        type : String,
        required : [true, "Please Enter Your Last Name"],
        maxlength : [12 , "Last Name Cannot More Then 12 Char."],
        minlength : [3, "Last Name Must Have 3 Char"]
    },
    email : {
        type : String,
        required : [true, "Please Enter Your Email"],
        unique : true,
        validate :  [validator.isEmail, "Please Enter a valid Email"]
    },
    password : {
        type : String,
        required : [true , "Please Enter Your Password"],
        minlength : [8,"Password Must Have 8 char."]
    },
    DOB : {
        type : String,
        required : true 
    },
    gender : {
        type : String,
        required : true,
        default : "male",
        lowercase : true
    },
    role : {
        type : String,
        required : true,
        default : "user"
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
    ,
    resetPasswordToken : String,
    resetPasswordExpire : Date
})

// encrypyt password
userSchema.pre("save",async function(next){

    if(!this.isModified("password")){
        next();
    }

    // making password in hash before making save 
    this.password = await bcrypt.hash(this.password,10)
})

// decrypt password
userSchema.methods.checkPassword = function(enterPassword){
    return bcrypt.compare(enterPassword,this.password);
}

// change password token
userSchema.methods.getResetPasswordToken = function(){
    // genrating token
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest('hex');
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000 

    return resetToken
}


// giving token to user
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{expiresIn : process.env.JWT_EXPIRE});
}


module.exports = new mongoose.model("User",userSchema);