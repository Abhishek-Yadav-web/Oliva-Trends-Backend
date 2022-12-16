const express = require('express');
const router = express.Router();

// 
const {
    createProduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
    productDetails
} = require('../controller/productContoller');
const { userProtected,roleProtected } = require('../middleware/authorized');

router.post('/admin/product/new',userProtected,roleProtected('admin','creator'),createProduct);
router.get('/products',getAllProduct);
router.put('/admin/product/update/:id',userProtected,roleProtected('admin','creator'),updateProduct);
router.delete('/admin/product/delete/:id',userProtected,roleProtected('admin','creator'),deleteProduct);
router.get('/product/:id',productDetails);

// export product
module.exports = router