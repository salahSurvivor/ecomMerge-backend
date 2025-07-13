const DeliveryMan = require('../models/deliveryMan.model.js');
const bcrypt = require('bcryptjs'); // For password hashing

// Read data
exports.readData = async (req, res) => {
    try {
        const deliveryMen = await DeliveryMan.find().sort({ _id: -1 }).lean();
        res.status(200).json(deliveryMen);
    } catch (err) {
        res.status(500).json(err.message);
    }
};

// Create data
exports.createData = async (req, res) => {
    try {
        // Hash the password before saving
        req.body.password = await bcrypt.hash(req.body.password, 10);
        const deliveryMan = await DeliveryMan.create(req.body);
        res.status(201).json(deliveryMan);
    } catch (err) {
        res.status(500).json(err.message);
    }
};

// Update data
exports.updateData = async (req, res) => {
    try {
        const { id } = req.params;

        // Hash the password if it's being updated
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        const updatedDeliveryMan = await DeliveryMan.findByIdAndUpdate(id, req.body, { new: true });
        if (updatedDeliveryMan) {
            res.status(200).json({ message: 'Updated successfully!', updatedDeliveryMan });
        } else {
            res.status(404).json({ message: 'DeliveryMan not found' });
        }
    } catch (err) {
        res.status(500).json(err.message);
    }
};

// Delete data
exports.deleteData = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedDeliveryMan = await DeliveryMan.findByIdAndDelete(id);
        if (deletedDeliveryMan) {
            res.status(200).json({ message: 'Deleted successfully!' });
        } else {
            res.status(404).json({ message: 'DeliveryMan not found' });
        }
    } catch (err) {
        res.status(500).json(err.message);
    }
};