const express = require('express');
const router = express.Router();
const path = require('path');
var request = require('request');

/* Redirige la requete vers le controlleur */
/* a remplacer par des requetes bluetooth */
router.post('/', function (req, res) {
	request({
		url: "192.168.1.23:3000", //url à stocker dans les données de l'objet
		method: "POST",
		json: true,
		body: req.body
	}, function (error, response, body){
		res.json({reponse : response});
		}
	);
});

module.exports = router;
