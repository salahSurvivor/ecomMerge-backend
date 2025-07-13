const mongoose = require('mongoose');

const deliveryManSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        vehicle: { type: String, required: true },
        licenseNumber: { type: String, required: true },
        email: { type: String, required: true, unique: true }, // Added email field
        password: { type: String, required: true } // Added password field
    },
    { timestamps: true }
);

const DeliveryMan = mongoose.model('DeliveryMan', deliveryManSchema);

module.exports = DeliveryMan;