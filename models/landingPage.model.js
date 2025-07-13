const mongoose = require('mongoose');


const LandingPageSchema = new mongoose.Schema({
        storeId : {type: String},
        p_id : {type: String },
        lp_Name: { type: String , required: true},
        path: { type: String }
});

module.exports = mongoose.model('LandingPage', LandingPageSchema);
