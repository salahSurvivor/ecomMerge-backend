const fs = require('fs');
const path = require('path');
const Mustache = require('mustache');
const LandingPage = require('../models/landingPage.model');

// Recursive function to copy a folder and its content
function copyFolderRecursiveSync(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  if (fs.lstatSync(source).isDirectory()) {
    const files = fs.readdirSync(source);
    files.forEach(file => {
      const curSource = path.join(source, file);
      const curTarget = path.join(target, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, curTarget);
      } else {
        fs.copyFileSync(curSource, curTarget);
      }
    });
  }
}

exports.generateLandingPage = async (req, res) => {
  try { 
    const {
      p_id, p_Name, title, description, feature1, feature2, feature3,
      img1, img2, img3, quantity, Price, promoPrice, totalP,
      dateP, storeId, dateCreation, societeCode, templateName, storeName, lp_Name, selectedPaymentModes
    } = req.body;

    const templateFolderPath = path.join(__dirname, `../landing_pages_templates/${templateName}`);
    const templatePath = path.join(templateFolderPath, 'index.mustache');
    const template = fs.readFileSync(templatePath, 'utf8');

    const view = {
      p_id, p_Name, title, description,
      feature1, feature2, feature3,
      img1, img2, img3,
      quantity, Price, promoPrice, totalP, storeName,
      value1: selectedPaymentModes.includes("Paypal"),
      value2: selectedPaymentModes.includes("Visa Card"),
      value3: selectedPaymentModes.includes("Cash On Delivery"),
    };
      
    const renderedHTML = Mustache.render(template, view);
    const outputDir = path.join(__dirname, '../landing_pages_generated');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    const lp_folder = path.join(outputDir, lp_Name);
    if (!fs.existsSync(lp_folder)) fs.mkdirSync(lp_folder);

    // Save rendered HTML
    const lpPath = path.join(lp_folder, 'index.html');
    fs.writeFileSync(lpPath, renderedHTML);

    // Copy static files from template folder to generated folder
    const filesToCopy = ['styles.css', 'script.js', 'forme.html'];
    filesToCopy.forEach(file => {
      const src = path.join(templateFolderPath, file);
      const dest = path.join(lp_folder, file);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
      }
    });

    // Copy 'assets' and 'pages' folder recursively
    const pagesSource = path.join(templateFolderPath, 'pages');
    const pagesTarget = path.join(lp_folder, 'pages');
    const assetsSource = path.join(templateFolderPath, 'assets');
    const assetsTarget = path.join(lp_folder, 'assets');
    if (fs.existsSync(assetsSource) && fs.existsSync(pagesSource)) {
      copyFolderRecursiveSync(assetsSource, assetsTarget);
      copyFolderRecursiveSync(pagesSource, pagesTarget);
    }

    const landingPageUrl = `http://localhost:3000/landing_pages_generated/${lp_Name}/index.html`;
    // Save in DB
    const newLanding = new LandingPage({
        storeId,
        p_id,
        lp_Name,
        path: landingPageUrl
    });

    await newLanding.save();

    res.status(201).json({
      message: 'Landing page generated and saved!',
      path: lpPath,
      url: landingPageUrl
    });
  } catch (error) {
    console.error('Error generating landing page:', error);
    res.status(500).json({ error: 'Failed to generate landing page' });
  }
};

exports.getLandingPageLink = async (req, res) =>{
  try{
      const sCode = req.query.sCode;
      const infos = await LandingPage.find();//.sort({ _id: -1 }).lean()
      res.status(200).json(infos);
  }
  catch(err){
      res.status(500).json(err.message);
  }
}