const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://ecom-merge:123456789tahaja@cluster0.ihu8b8o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(() => {
    console.log('Connected To Mongodb');
})
.catch((err) => {
    console.log(err);
})

module.export = mongoose;