const asyncHandler =require('express-async-handler')
const stripe = require('stripe')(process.env.STRIPE_SECRECT_KEY)

exports.processPayment= asyncHandler(async(req,res,nxt) => {
    const myPayment = await stripe.paymentIntents.create({
        amount : req.body.amount,
        currency : "inr",
        metadata : {
            company : 'Oliva-Trends'
        }
    })

    res.status(200).json({
        success : true,
        client_secret : myPayment.client_secret
    })
})

exports.sendStripeApiKey= asyncHandler(async(req,res,nxt) => {
    res.status(200).json({
        success : true,
        stripe_api_key : process.env.STRIPE_API_KEY
    })
})