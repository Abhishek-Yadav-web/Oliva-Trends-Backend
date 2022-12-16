const mongoose = require('mongoose');

const mongo = () => {
    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log(`Mongo Is Connected 🍁`);
    })
    .catch((error) => {
        console.log(`Something Went Wrong : ${error}`);
    })
}


module.exports =  mongo