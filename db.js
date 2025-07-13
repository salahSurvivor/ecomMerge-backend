const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/ecom-merge')
.then(() => {
    console.log('Connected To Mongodb');
})
.catch((err) => {
    console.log(err);
})

module.export = mongoose;