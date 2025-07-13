const Model = require('../models/purchase.model.js');

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
exports.createData = async (req, res) => {
  try {
    let lastRecord = await Model.findOne({ societeCode: req.body.societeCode }).sort({ '_id': -1 });
    req.body.number = lastRecord ? lastRecord.number + 1 : 1;

    if (req.files) {
      if (req.files.productImg1) req.body.productImg1 = req.files.productImg1[0].filename;
      if (req.files.productImg2) req.body.productImg2 = req.files.productImg2[0].filename;
      if (req.files.productImg3) req.body.productImg3 = req.files.productImg3[0].filename;
    }

    const newPurchase = await Model.create(req.body);
    //console.log(req.body)
    res.status(201).json(newPurchase);

  } catch (err) {
    console.error("Error creating purchase:", err);
    res.status(500).json({ error: err.message });
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
        const {id} = req.params;
        console.log('infos', id);
        const infos = await Model.findByIdAndDelete(id);
        console.log('infos', infos);
        if(infos)
            res.status(200).json({message: `Deleted with success!!`});      
    }
    catch(err){
        res.status(500).json(err.message);
    }
};