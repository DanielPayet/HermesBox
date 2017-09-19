// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient
var mongoose = require('mongoose');
var assert = require('assert');

// Get our API routes
const api = require('./routes/api');
const toogle = require('./routes/toogle');
const status = require('./routes/status');

const app = express();

/**
 * Configuration serveur
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Route du serveur
 */
app.use('/api', api);
app.use('/toogle',toogle);
app.use('/status', status);


/**
 * Route par defaut
 */
app.get('*', (req, res) => {
  res.sendStatus(404);
});

/**
 * Connexion à la base de donnée
 */
mongoose.connect('mongodb://localhost:27017/HermesDB', {useMongoClient: true});

var db = mongoose.connection;

db.once('open', function () {	
	const server = http.createServer(app);
	server.listen(port, () => console.log('Le serveur REST a démarré'));
});



