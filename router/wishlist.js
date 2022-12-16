const express = require('express');
const { addInWishlist, removeFromWishlist, getProductFromWishlist, checkInWishlist } = require('../controller/wishlistController');
const router = express.Router();
const {userProtected,roleProtected} = require('../middleware/authorized')

router.put('/wishlist/add/:id',userProtected,addInWishlist)
router.delete('/wishlist/remove/:id',userProtected,removeFromWishlist)
router.get('/wishlist',userProtected,getProductFromWishlist)
router.post('/wishlist/inWishlist/:id',userProtected,checkInWishlist)


module.exports = router