const Model = require('../models/losses.model.js');

// read data
exports.readData = async(req, res) => {
    try{
        const sCode = req.query.sCode;
        const infos = await Model.find({ societeCode: sCode }).sort({ _id: -1 }).lean();
        res.status(200).json(infos);
    }
    catch(err){
        res.status(500).json(err.message);
    }
};

// add data
exports.createData = async(req, res) => {
    try{
        let lastRecod = await Model.findOne({ societeCode: req.body.societeCode }).sort({'_id': -1});
        req.body.number = lastRecod?.number ? lastRecod.number + 1 : 1;

        await Model.create(req.body);
        res.status(200).json(true);
    }
    catch(err){
        res.status(500).json(err.message);
    }
};

// update data
exports.updateData = async(req, res) => {
    try{
        const {id} = req.params;
        const infos = await Model.findByIdAndUpdate(id, req.body);
    
        if(infos)
            res.status(200).json({message: `Updated with success!!`});               
    }
    catch(err){
        res.status(500).json(err.message);
    }
};

// delete data
exports.deleteData = async(req, res) => {
    try{ 
        const {_id} = req.params;
        const infos = await Model.findByIdAndDelete(_id);
        console.log('infos', infos);
        if(infos)
            res.status(200).json({message: `Deleted with success!!`});      
    }
    catch(err){
        res.status(500).json(err.message);
    }
};