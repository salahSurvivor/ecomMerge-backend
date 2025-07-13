const mongoose = require('mongoose');

const UsersSchema = mongoose.Schema(
    {
        name: { type: String },
        userName: { type: String },
        email: { type: String },
        Address: { type: String },
        phone: { type: String },
        vehicle: { type: String },
        licenseNumber: { type: String },
        password: { type: String },
        isAdmin: { type: Boolean },
        isDeliveryMan: { type: Boolean }        
    },
    {
        timestmaps: true
    }
)

const Users = mongoose.model('Users', UsersSchema);

module.exports = Users;