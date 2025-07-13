const fs = require('fs');
const path = require('path');
const multer = require('multer');
const Mustache = require('mustache');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/\s+/g, '-').toLowerCase();
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${baseName}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({ storage });

module.exports = app => {
    //const fs = require('fs');
    //const path = require('path');
    const ordersController = require('./controllers/orderController');
    const deliveryManController = require('./controllers/deliveryMan.controller.js');
    const lossessController = require('./controllers/losses.controller');
    const purchasesController = require('./controllers/purchase.controller');
    //const paymentModeController = require('./controllers/paymentMode.controller.js');
    const storeController = require('./controllers/store.controller.js');
    const landingCtrl = require('./controllers/landingPage.controller.js')

    
    //#region Orders

    app.get('/orders', ordersController.readData); // Read Data

    //app.post('/orders', ordersController.createData); // Create Data
    app.post('/api/orders', ordersController.createData);
    
    app.put('/orders/:id', ordersController.updateData); // Update Data
    
    app.delete('/orders/:id', ordersController.deleteData); // Delete Data

    app.get('/ordersProfits', ordersController.calculProfits) // Calcul Profits

    app.get('/getDataForDelivery', ordersController.getDataForDelivery) // Calcul Profits


    //#endregion Orders

     //#region Losses
     app.get('/losses', lossessController.readData); // Read Data

     app.post('/losses', lossessController.createData); // Create Data
     
     app.put('/losses/:id', lossessController.updateData); // Update Data
     
     app.delete('/losses/:_id', lossessController.deleteData); // Delete Data
     //#endregion Losses
 
     //#region Purchase
     app.get('/purchases', purchasesController.readData); // Read Data

     //app.post('/purchases', purchasesController.createData); // Create Data
     app.post('/purchases', upload.fields([  // Create Data
        { name: 'productImg1', maxCount: 1 },
        { name: 'productImg2', maxCount: 1 },
        { name: 'productImg3', maxCount: 1 }
    ]), purchasesController.createData);
              
     app.put('/purchases/:id', purchasesController.updateData); // Update Data
          
     app.delete('/purchases/:id', purchasesController.deleteData); // Delete Data
     
    //#endregion Purchase

     //#region DeliveryMan
    app.get('/deliverymen', deliveryManController.readData); // Read Data
    app.post('/deliverymen', deliveryManController.createData); // Create Data
    app.put('/deliverymen/:id', deliveryManController.updateData); // Update Data
    app.delete('/deliverymen/:id', deliveryManController.deleteData); // Delete Data
    //#endregion DeliveryMan    
    
    //#region Stores
    app.get('/store', storeController.readData); // Read Data 
    app.post('/store', storeController.createData); // Create Data
    app.put('/store/:id', storeController.updateData); // Update Data
    app.delete('/store/:id', storeController.deleteData); // Delete Data
    //#endregion Stores  

    
    // Landing pages : Route pour retourner la liste des templates disponibles
    
    app.get('/templates', (req, res) => {
        const templatesDir = path.join(__dirname, 'landing_pages_templates');

        fs.readdir(templatesDir, (err, folders) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Impossible de lire les templates' });
            }

            const templates = folders
                .filter(name => fs.lstatSync(path.join(templatesDir, name)).isDirectory())
                .map(name => ({
                    name,
                    previewUrl: `/landing_pages_templates/${name}/preview.png`,  // tu peux changer ça si tu n’as pas de preview.png
                    folderPath: `/landing_pages_templates/${name}`
                }));

            res.json(templates);
        });
    });
    app.post('/landing-pages/generate', landingCtrl.generateLandingPage);
    app.get('/landing-pages/getLink', landingCtrl.getLandingPageLink);


    // profile

    //app.get('/payment-modes', paymentModeController.readData); // Read all payment modes
    //app.post('/payment-modes', paymentModeController.createData); // Create a new payment mode
    //app.put('/payment-modes/:id', paymentModeController.updateData); // Update a payment mode by ID
    //app.delete('/payment-modes/:id', paymentModeController.deleteData); // Delete a payment 
};