const express = require('express');
const { processPayment, sendStripeApiKey } = require('../controller/paymentController');
const router = express.Router();
const {userProtected} = require('../middleware/authorized')

router.post('/payment/process',processPayment)
router.get('/payment/apiKey',sendStripeApiKey)

module.exports = router