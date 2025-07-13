const mongoose = require('mongoose')

const orderDetailsSchema = mongoose.Schema({
    location: { type: String },
    date: {type: Date},
    timeStart: { type: String },
    timeEnd: { type: String },
    deliveryManId: { type: String },
    description: { type: String }
});

const ordersSchema = mongoose.Schema(
    {
        number: { type: Number },
        name: { type: String },
        city: { type: String },
        date: { type: Date },
        phone: { type: String },
        quantity: { type: Number },
        purchasePrice: { type: Number },
        salePrice: { type: Number},
        status: { type: String },
        totalP: { type: Number },
        modePayement : { type: String },
        isConfirmed: { type: Boolean },
        orderDetails: orderDetailsSchema,
        cancellationReason: { type: String },
        deliveryManId: { type: String },
        productId: { type: String },
        societeCode: { type: String },
    },
    { timestamps: true }
)


const Order = mongoose.model('Order', ordersSchema);

module.exports = Order;