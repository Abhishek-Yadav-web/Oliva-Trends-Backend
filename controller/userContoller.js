const User = require('../model/User');
const asyncHandler = require('express-async-handler');
const sendToken = require('../utils/jwtToken');
const sendMail = require('../middleware/sendMailer');
const crypto = require('crypto');
const Product = require('../model/Product');
const orderModel = require('../model/Order');

/*
1. Register User
2. Login User
3. Logout User
4. Forget Password
5. reset/change password
6. User Profile
7. Update User Password
8. Update User Email
9. Update User Profile
10. Get All User -- ADMIN
11. Get Single User -- ADMIN
12. Give Role -- ADMIN
13. Delete User -- ADMIN
*/


// 1.
const registerUser = asyncHandler(async(req,res,nxt) => {
    const {email} = req.body;

    // find user by email
    let user = await User.findOne({email});

    // if user found then what to response
    if(user){
        return res.status(400).json({
            success : false,
            error : `user already register by this ${email} email`
        })
    }

    // create user
    user = await User.create(req.body); 

    // response with token
    sendToken(user,201,res,'User Register Succesfully')

})

// 2.
const loginUser = asyncHandler(async(req,res,nxt) => {
    const {email,password} = req.body;

    // find user by email
    let user = await User.findOne({email}).select("+password");


    // if user found then what to response
    if(!user){
        return res.status(400).json({
            success : false,
            error : `Invalid Email or Password`
        })
    }

    // comparing password from userModel
    const comparePassword = await user.checkPassword(password);

    if(comparePassword !== true){
        return res.status(400).json({
            success : false,
            error : `Invalid Email or Password`
        })
    }

    // response with token
    sendToken(user,200,res,'User Login Succesfully')
})

// 3.
const logoutUser = asyncHandler(async(req,res,nxt) => {

    // removing token from cookies
    res.status(200).cookie('token',null,{
        expires : new Date(Date.now()),
        httpOnly :  true
    }).json({
        success : true,
        message : "User Logged Out"
    })
})

// 4.
const forgetPassword = asyncHandler(async(req,res,nxt) => {
    const user = await User.findOne({email : req.body.email});

    if(!user){
        return res.status(401).json({
            success :  false,
            error : 'User Not Register'
        })
    }

    // get reset password token from user model
    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave : false})

    console.log(req.get("host"));

    // sending reset url to user
    console.log(process.env.FRONT_URI);
    const sendUrl = `${req.protocol}>://${req.get("host")}/password/reset/${resetToken}`
    const message = `\n
    Hello, ${req.body.email}
    \n
    \t\tYour recovery password link is here :\n
    \t\t${sendUrl}
    \n
    \t\tNote : THIS LINK WILL EXPIRE AFTER 15 MIN
    \n\n
    Thank you.
    `

    try {

        // Sending Email To User
        await sendMail({
            email : req.body.email,
            subject : 'Oliva-Trends : Recovery Link',
            message 
        })

        res.status(201).json({
            success : true,
            message : `Email Send To : ${req.body.email}`,
            url : sendUrl
        })
        
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave : false})

        return res.status(500).json({
            success : false,
            error 
        })
    }
})

// 5.
const resetPassword =  asyncHandler(async (req,res,nxt) => {

    // making userResetToken in hash
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest('hex');
    const user = await User.findOne({resetPasswordToken, resetPasswordExpire : {$gt : Date.now()}});


    if(!user){
        return res.status(400).json({
            success : false,
            error : `Bad Requset : Token Invalid Or Has Been Expired`
        })
    }

    if(req.body.password !== req.body.confPassword){
        return res.status(400).json({
            success : false,
            error : `Password Not Matched`
        })
    }

    // changing details from database
    user.password = req.body.confPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // saving user data in mongo
    await user.save();

    sendToken(user,200,res,'Changed Password Succesfully')
})

// 6. 
const getUserDetails = asyncHandler(async (req,res,nxt) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success : true,
        message :  `User Details`,
        data : user
    })
})

// 7.
const updateUserPassword = asyncHandler(async (req,res,nxt) =>{

    // find user
    const user = await User.findById(req.user.id);

    // decrpyt password
    const oldPassword = await user.checkPassword(req.body.oldPassword)

    if(oldPassword !== true){
        return res.status(400).json({
            success : false,
            error : `Wrong Old Password`
        })
    }

    if(oldPassword ===  req.body.newPassword){
        return res.status(400).json({
            success : false,
            error : `Please Put Some New Password`
        })
    }

    // changing user old password with new password
    user.password = req.body.newPassword;

    // saving user data in mongo
    await user.save();

    res.status(200).json({
        success : true,
        message :  `Updated User Password, Successfully`,
        isUpated : true
    })

})

// 8. 
const updateUserEmail = asyncHandler(async(req,res,nxt) => {
    // find user
    const user = await User.findById(req.user.id);

    // decrpyt password
    const currentPassword = await user.checkPassword(req.body.currentPassword)

    if(currentPassword !== true){
        return res.status(400).json({
            success : false,
            error : `Wrong Password`
        })
    }

   const  alreadyUser = await User.findOne({email : req.body.newEmail});


    if(alreadyUser){
        return res.status(400).json({
            success : false,
            error : `Email Id already exist, Try another. `
        })
    }

    user.email = req.body.newEmail;

    // saving user data in mongo
    await user.save();

    res.status(200).json({
        success : true,
        message :  `Updated User Email`,
        isUpated : true
    })
})

// 9. 
const updateUserProfile = asyncHandler(async (req,res,nxt) => {

    // getting information from req.body
    const {fName,lName,DOB,gender} = req.body;

    // making data what to update
    const data = {
        firstName : fName,
        lastName : lName,
        DOB,
        gender
    }

    const user = await User.findByIdAndUpdate(req.user.id,data,{
        new : true,
        runValidators : true,
        useFindAndModify : false
    })

    if(!user) {
        return res.status(400).json({
            success : false,
            error : `Internal Server Error`,
        })
    }

    res.status(200).json({
        success : true,
        message : `User Profile Infomation Updated`,
        isUpated : true
    })
})

// 10.
const getAllUserADMIN = asyncHandler(async(req,res,nxt) => {
    const user = await User.find();

    res.status(200).json({
        success : true,
        message : `All User Details`,
        data : user.reverse(),
        totalUser : user.length
    })
})

// 11.
const getSingleUserADMIN = asyncHandler(async(req,res,nxt) => {
    const user = await User.findById(req.params.id);

    if(!user){
        return res.status(404).json({
            success : false,
            error : `User Not Found`
        })
    }

    res.status(200).json({
        success : true,
        message : `user Details`,
        data : user
    })
})

// 12. 
const giveRoleADMIN = asyncHandler(async (req,res,nxt) => {
    let user = await User.findById(req.params.id);

    if(!user){
        return res.status(404).json({
            success : false,
            error : `User Not Found`
        })
    }

    const data = {
        role : req.body.role
    }

    user = await User.findByIdAndUpdate(req.params.id,data,{
        new : true,
        runValidators : true,
        useFindAndModify : false
    })

    res.status(200).json({
        success : true,
        message : `Role Updated`,
        data : user
    })
})

// 13. 
const deleteUserADMIN = asyncHandler(async (req,res,nxt) => {
    const user = await User.findById(req.params.id);

    if(!user){
        return res.status(404).json({
            success : false,
            error : `User Not Found`
        })
    }
    
    await user.remove();

    res.status(200).json({
        success : true,
        message : `User Got Deleted`
    })
})

const getAllDashboardDataADMIN = asyncHandler(async (req,res,nxt) => {
    const user = await User.find();
    const product = await Product.find();
    const order = await orderModel.find();
    let totalAmount = 0;

    order.forEach((order) => {
        totalAmount += order.totalPrice
    })

    res.status(200).json({
        success : true,
        data : {
            totalUser : user.length,
            product : product.length,
            order : order.length,
            totalAmount
        }
    })
})


module.exports = {registerUser,loginUser,logoutUser,forgetPassword,resetPassword,getUserDetails,updateUserPassword, updateUserEmail, updateUserProfile, getAllUserADMIN,getSingleUserADMIN,giveRoleADMIN,deleteUserADMIN,getAllDashboardDataADMIN}