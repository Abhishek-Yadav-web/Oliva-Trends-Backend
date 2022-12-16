const asynchandler = require('express-async-handler');

const home = asynchandler(async (req,res) => {
    res.status(200).json({
        success : true,
        message : `Ajio-server is working 🚀`
    })
})

module.exports = home