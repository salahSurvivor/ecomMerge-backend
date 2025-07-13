const mongoose = require('mongoose')

const lossesSchema = mongoose.Schema(
    {
        number: { type: Number },
        name: { type: String },
        price: { type: Number },
        date: { type: Date },
        societeCode: { type: String }
    },
    { timestamps: true }
)


const Losses = mongoose.model('Losses', lossesSchema);

module.exports = Losses;