const sendToken = (user,sCode,res,message) => {

    // getting token from userModel
    const token = user.getJWTToken();

    const options = {
        expires : new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly :  true
    }

    res.status(sCode).cookie('token',token,options).json({
        success : true,
        message,
        data : user,
        token 
    })
}

module.exports =  sendToken