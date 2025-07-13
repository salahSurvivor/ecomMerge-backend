const mongoose = require('mongoose')

const purchaseSchema = mongoose.Schema(
    {
        number: { type: Number },
        productName: { type: String , required: true},
        productTitle: { type: String , required: true},
        productDescription: { type: String , required: true},
        productFeature1: { type: String , required: true},
        productFeature2: { type: String , required: true},
        productFeature3: { type: String , required: true},
        productImg1: { type: String , required: true},
        productImg2: { type: String , required: true},
        productImg3: { type: String , required: true},
        productquantity: { type: Number , required: true},
        purchasePrice: { type: Number , required: true},
        salePrice: { type: Number, required: true},
        totalP: { type: Number },
        dateP: { type: String },
        storeId: { type: String },
        societeCode : { type: String }
    },
    { timestamps: true }
)


const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = Purchase;