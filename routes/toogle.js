const express = require('express');
const router = express.Router();
const path = require('path');
var request = require('request');
const Objet = require('../objet-model');

/* Redirige la requete vers le controlleur */
router.post('/:objet_id', function (req, res) {
	let url;
	Objet.findById(req.params.objet_id, function (err, objet) {
		if (err) res.send(err);
		url = "http://" + objet.url + ":3000/";
	});
	request.post({ uri: url, form: req.body }, (err) => {
		if (err) console.log(err);
	});

});

module.exports = router;
