const Order = require('../models/order.model.js');
const Purchase = require('../models/purchase.model.js');
const Losses = require('../models/losses.model.js');

// read data
exports.readData = async(req, res) => {
    try{
        const sCode = req.query.sCode;
        //console.log('enteeeeeeeer');
        const infos = await Order.find({ societeCode: sCode }).sort({ _id: -1 }).lean();
        res.status(200).json(infos);
    }
    catch(err){
        res.status(500).json(err.message);
    }
};

// add data
exports.createData = async(req, res) => {
  try {
      const { clientName, clientPhone, city, quantity, productId, paymentMode } = req.body;
      // Validation des données
      if (!clientName || !clientPhone) {
          return res.status(400).json({ error: 'Nom et téléphone sont obligatoires' });
      }
      let productDetails = await Purchase.findOne({'_id': req.body.productId});
      
      //console.log('payment Mode IS :', req.body.paymentMode);
      
      let lastRecod = await Order.findOne({}).sort({'_id': -1});
      RecodNumber = lastRecod?.number ? lastRecod.number + 1 : 1;
      let orderData = {
        number: RecodNumber,
        name: req.body.clientName,
        date: new Date(),
        city: req.body.city,
        phone:req.body.clientPhone,
        quantity: req.body.quantity,
        purchasePrice: productDetails.purchasePrice,
        salePrice: productDetails.salePrice,
        status: "In progress",
        totalP: (productDetails.salePrice) * (req.body.quantity),
        modePayement: req.body.paymentMode,
        societeCode: productDetails.societeCode
      }
      await Order.create(orderData);
      res.status(200).json(true);
      // Réponse de succès

    } catch (error) {
      console.error('Erreur serveur:', error);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};

// update data
exports.updateData = async(req, res) => {
    try{
        const {id} = req.params;
        const infos = await Order.findByIdAndUpdate(id, req.body);
    
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
        const infos = await Order.findByIdAndDelete(id);

        if(infos)
            res.status(200).json({message: `Deleted with success!!`});       
    }
    catch(err){
        res.status(500).json(err.message);
    }
};

// Calcul Profits
exports.calculProfits = async (req, res) => {
  try {
    const sCode = req.query.sCode;
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Total Order Amounts (Updated: price * quantity)
    const totalAmounts = await Order.aggregate([
      { $match: { societeCode: sCode, status: 'Delivered' } },
      {
        $group: {
          _id: null,
          saleTotal: {
            $sum: {
              $multiply: [
                { $toDouble: "$salePrice" },
                { $toInt: "$quantity" }
              ]
            }
          },
          purchasesTotal: {
            $sum: {
              $multiply: [
                { $toDouble: "$purchasePrice" },
                { $toInt: "$quantity" }
              ]
            }
          }
        }
      }
    ]);

    // Total Purchases
    const totalPurchases = await Purchase.aggregate([
      { $match: { societeCode: sCode } },
      {
        $group: {
          _id: null,
          purchasesTotal: { $sum: { $toDouble: "$totalP" } },
        }
      }
    ]);

    // Total Losses
    const totalLosses = await Losses.aggregate([
      { $match: { societeCode: sCode } },
      {
        $group: {
          _id: null,
          lossesTotal: { $sum: { $toDouble: "$price" } },
        }
      }
    ]);

    // Monthly Losses
    const totalLossesMonth = await Losses.aggregate([
      {
        $match: {
          societeCode: sCode,
          date: { $gte: startOfMonth, $lt: endOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          lossesTotal: { $sum: { $toDouble: "$price" } },
        }
      }
    ]);

    // Daily Losses
    const totalLossesDay = await Losses.aggregate([
      {
        $match: {
          societeCode: sCode,
          date: { $gte: startOfDay, $lt: endOfDay }
        }
      },
      {
        $group: {
          _id: null,
          lossesTotal: { $sum: { $toDouble: "$price" } },
        }
      }
    ]);

    // Monthly Order Amounts (Updated: price * quantity)
    const totalMonthAmounts = await Order.aggregate([
      {
        $match: {
          societeCode: sCode,
          status: 'Delivered',
          date: { $gte: startOfMonth, $lt: endOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          totalSale: {
            $sum: {
              $multiply: [
                { $toDouble: "$salePrice" },
                { $toInt: "$quantity" }
              ]
            }
          },
          purchasesTotal: {
            $sum: {
              $multiply: [
                { $toDouble: "$purchasePrice" },
                { $toInt: "$quantity" }
              ]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalSale: 1,
          purchasesTotal: 1,
          monthPofits: { $subtract: ["$totalSale", "$purchasesTotal"] }
        }
      }
    ]);

    // Daily Order Amounts (Updated: price * quantity)
    const totalDayAmounts = await Order.aggregate([
      {
        $match: {
          societeCode: sCode,
          status: 'Delivered',
          date: { $gte: startOfDay, $lt: endOfDay }
        }
      },
      {
        $group: {
          _id: null,
          totalSale: {
            $sum: {
              $multiply: [
                { $toDouble: "$salePrice" },
                { $toInt: "$quantity" }
              ]
            }
          },
          purchasesTotal: {
            $sum: {
              $multiply: [
                { $toDouble: "$purchasePrice" },
                { $toInt: "$quantity" }
              ]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalSale: 1,
          purchasesTotal: 1,
          dayProfits: { $subtract: ["$totalSale", "$purchasesTotal"] }
        }
      }
    ]);

    // Final calculations
    let totalMoney = (totalAmounts[0]?.saleTotal || 0)
      - (totalPurchases[0]?.purchasesTotal || 0)
      - (totalLosses[0]?.lossesTotal || 0);

    let totalProfits = (totalAmounts[0]?.saleTotal || 0)
      - (totalAmounts[0]?.purchasesTotal || 0)
      - (totalLosses[0]?.lossesTotal || 0);

    let monthProfits = (totalMonthAmounts[0]?.monthPofits || 0)
      - (totalLossesMonth[0]?.lossesTotal || 0);

    let dayProfits = (totalDayAmounts[0]?.dayProfits || 0)
      - (totalLossesDay[0]?.lossesTotal || 0);

    const data = {
      totalMoney,
      totalProfits,
      monthProfits,
      dayProfits
    };

    console.log('data: ', data);

    res.status(200).json(data);

  } catch (err) {
    res.status(500).json(err.message);
  }
};


exports.getDataForDelivery = async(req, res) => {
  try{
      const sCode = req.query.sCode;
      const infos = await Order.find({ 
        societeCode: sCode,
        $or: [ { status: 'Confirmed' }, { status: "Delivered" }, {$and: [ { status: "Canceled" }, { isConfirmed: true } ] }], 
        isConfirmed: true }).sort({ _id: -1 }).lean();
        
        res.status(200).json(infos);
  }
  catch(err){
      res.status(500).json(err.message);
  }
};