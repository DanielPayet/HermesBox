const router = require('express').Router();
const Objet = require('../objet-model');
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://test.mosquitto.org:1883');

/* Redirige la requete vers le controlleur */
router.post('/:objet_id', function (req, res) {
	Objet.findById(req.params.objet_id, function (err, objetFromId) {
		if (err) res.send(err);
		//client.publish(objet.url + '/toogle', req.body['setTo']);
		client.publish('dadou974974974/toogle', req.body['setTo']);

	});
});

module.exports = router;
