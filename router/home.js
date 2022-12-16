const express = require('express');
const home = require('../controller/homeController');
const router = express.Router();

router.get("/",home);


module.exports = router