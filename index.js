const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const userController = require('./controllers/usersController.js');

require('./db.js');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use('/landing_pages_templates', express.static(path.join(__dirname, 'landing_pages_templates')));
app.use('/landing_pages_generated', express.static(path.join(__dirname, 'landing_pages_generated')));
app.use('/back-end/landing_pages_templates', express.static(path.join(__dirname, 'landing_pages_templates')));

require('./routes')(app);
app.use('/', userController);

// Exposer le dossier uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Démarrer le serveur
app.listen(4200, () => {
  console.log('Server running on http://localhost:4200');
});

// start the server
const port = process.env.port || 3000;
app.listen(port, () => console.log(`The Port Run On ${port}...`));