const express = require('express');
const { newOrder, singleOrder, myOrder, allOrderADMIN, updateStatusADMIN, deleteOrderADMIN } = require('../controller/orderController');
const router = express.Router();
const {userProtected,roleProtected} = require('../middleware/authorized')

router.post('/order/new',userProtected,newOrder);
router.get('/order/:id',userProtected,singleOrder);
router.get('/order/my/orders',userProtected,myOrder);
router.get('/admin/order/orders',userProtected,roleProtected("admin"),allOrderADMIN);
router.put('/admin/order/updated/status/:id',userProtected,roleProtected("admin"),updateStatusADMIN);
router.delete('/admin/order/delete/:id',userProtected,roleProtected("admin"),deleteOrderADMIN);


module.exports = router