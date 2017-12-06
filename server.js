/**
 * Configuration utils
 */
const job = require('./jobs/job');
var ping = require('ping');

/**
 * Configuration AWS
 */
var AWS = require('aws-sdk');

// AWS DynamoDB 
AWS.config.update({ region: 'eu-west-2' });
var dynamodb = new AWS.DynamoDB();

// AWS IOT
var awsIot = require('aws-iot-device-sdk');
var device = awsIot.device({
  keyPath: './secure/HermesBox.private.key',
  certPath: './secure/HermesBox.cert.pem',
  caPath: './secure/root-CA.crt',
  clientId: 'HermesBox',
  host: 'a2vl9qu270bg23.iot.eu-west-2.amazonaws.com'
});

/**
 * Configuration Express
 */
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const app = express();

/**
 * Configuration serveur
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const port = process.env.PORT || '3000';
app.set('port', port);

// Route par defaut

app.get('*', (req, res) => {
  res.sendStatus(404);
});

// Route API 
const api = require('./routes/api');
const toogle = require('./routes/toogle');
const status = require('./routes/status');

/**
 * Execution serveur
 */
const server = http.createServer(app);
server.listen(port, () => console.log('Le serveur à démarré'));

onStart();

function onStart(){
  getModules();
  getModule('1').then((result)=> console.log(result.Item))
}

device
  .on('connect', function () {
    device.subscribe('connexionModule');
    device.subscribe('closeModule');
  });

device
  .on('message', function (topic, payload) {
    information = JSON.parse(payload.toString());
    switch (topic) {
      case 'connexionModule':
        updateEtat(information.moduleId.toString(), true);
        console.log('Le module ' + information.moduleId + ' est en ligne');
        break;
      case 'closeModule':
        updateEtat(payload.moduleId, false);
        console.log('Le module ' + information.moduleId + ' est en hors-ligne');
        break;
      default: 'Chanel MQTT inconnu'; break;
    }
  });

async function getModule(id){
  var params = {
    Key: {
      "ModuleId": {
        N: id
      }
    }, 
    TableName: "HermesModules"
   };
  return await dynamodb.getItem(params, function(err, data) {
     if (err) console.log(err, err.stack);
   });
}

/**
 * Récupère les modules présent dans la table HermesModules.
 */
function getModules() {
  var params = {
    TableName: "HermesModules"
  };
  dynamodb.scan(params, function (err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      data.Items.forEach(element => {
        testPing(element.ip.S, element.name.S).then(ip )
      });
    }
  });
}

/**
 * Mets à jour la table
 * @param {*} id 
 * @param {*} isOn 
 */
function updateEtat(id, isOn) {
  var params = {
    ExpressionAttributeNames: {
      "#ETAT": "etat",
    },
    ExpressionAttributeValues: {
      ":e": {
        BOOL: isOn
      }
    },
    Key: {
      "ModuleId": {
        N: id
      }
    },
    ReturnValues: "ALL_NEW",
    TableName: "HermesModules",
    UpdateExpression: "SET #ETAT = :e"
  }
  dynamodb.updateItem(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
  });
}

/**
 * test si l'hote est joinable
 * @param {*} host 
 */
async function testPing(host, name){
    isConnecte = false;
    await ping.sys.probe(host, function(isAlive){
        var msg = isAlive ? name + ' est en ligne' : name + ' est hors-ligne';
        console.log(msg);
        isConnecte = isAlive;
    });
    return isConnecte;
};