const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../model/User');


// checking user login
const userProtected = asyncHandler(async (req,res,nxt) => {
    const { token } = req.cookies;

    // checking if token is available or not
    if(!token){
        return res.status(400).json({
            success : false,
            message : `Please Be Login To Access This Resources`
        })
    }

    const decodeData = jwt.verify(token,process.env.JWT_SECRET);

    if(!decodeData){
        return res.status(400).json({
            success : false,
            message : `Please Be Login To Access This Resources`
        })
    }

    req.user = await User.findById(decodeData.id);

    nxt();
})

//checking user role
const roleProtected = (...roles) => {
    return (req,res,nxt) => {
        if(!roles.includes(req.user.role)){
            return res.status(400).json({
                success : false,
                message : `You Are Not Autorized For This Resources`
            })
        }

        nxt();
    }
}


module.exports = {userProtected,roleProtected}