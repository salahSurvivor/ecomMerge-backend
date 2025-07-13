const mongoose = require('mongoose');

const storeSchema = mongoose.Schema(
    {
        name: { type: String },
        description: { type: String },
        category: { type: String },
        societeCode: { type: String },
    },
    { timestamps: true }
);

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;