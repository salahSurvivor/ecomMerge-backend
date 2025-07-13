const Store = require('../models/store.model.js');

// Read all stores
exports.readData = async (req, res) => {
    try {
        const sCode = req.query.sCode;
        const stores = await Store.find({ societeCode: sCode }).sort({ _id: -1 }).lean();
        res.status(200).json(stores);
        //cosole .log(req, res) 
    } catch (err) {
        res.status(500).json(err.message);
    }
};

// Create a new store
exports.createData = async (req, res) => {
    try {
        const store = await Store.create(req.body);
        res.status(201).json(store);
    } catch (err) {
        res.status(500).json(err.message);
    }
};

// Update a store
exports.updateData = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedStore = await Store.findByIdAndUpdate(id, req.body, { new: true });
        if (updatedStore) {
            res.status(200).json({ message: 'Updated successfully!', updatedStore });
        } else {
            res.status(404).json({ message: 'Store not found' });
        }
    } catch (err) {
        res.status(500).json(err.message);
    }
};

// Delete a store
exports.deleteData = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedStore = await Store.findByIdAndDelete(id);
        if (deletedStore) {
            res.status(200).json({ message: 'Deleted successfully!' });
        } else {
            res.status(404).json({ message: 'Store not found' });
        }
    } catch (err) {
        res.status(500).json(err.message);
    }
};