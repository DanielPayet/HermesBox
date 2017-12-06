const Objet = require('../objet-model');
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://test.mosquitto.org:1883');

var initialisation = () => {
    console.log('init mqtt');
    Objet.find(function (err, objets) {
        let ReponseDemandeEnLigne = false;
        client.on('connect', () => {
            console.log("connexion");
            objets.forEach((objet) => {
                client.subscribe('dadou974974974' + '/connectee');
                client.subscribe('dadou974974974' + '/status');
                client.subscribe('dadou974974974/reponseEnLigne');
            });
        })

        client.on('message', (topic, message) => {
            objets.forEach((objet) => {
                console.log(objet.nom);
                switch (topic) {
                    case 'dadou974974974' + '/connectee':
                        return setConnectee(objet, message);
                    case 'dadou974974974' + '/status':
                        return setStatus(objet, message);
                    case 'dadou974974974/reponseEnLigne':
                        console.log("iot a repondu");
                        ReponseDemandeEnLigne = true;
                        return true;
                    default:
                        console.log("Un objet inconnu à voulu interagire")
                }
                console.log("---------");
            });
        });

        objets.forEach((objet) => {
            setInterval(() => {
                console.log("execute internal callback");
                let ARepondu = false;
                let nombredeVerification = 3;
                client.publish('dadou974974974/demandeEnLigne', 'true');
                while (!ARepondu && nombredeVerification != 0) {
                    wait(1000);
                    ARepondu = ReponseDemandeEnLigne;
                    nombredeVerification--;
                }
                setConnectee(objet, ARepondu);
                ReponseDemandeEnLigne = false;
            }, 6 * 1000);
        });
    });
}

function setConnectee(objet, message) {
    if (message) {
        objet.set("enLigne", true);
    } else {
        objet.set("enLigne", false);
    }
    objet.save((err) => {
        if (err) console.log(err);
    });
}

function setStatus(objet, message) {
    objet.set("status", message);

    objet.save((err) => {
        if (err) console.log(err);
    });
}

function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
}

module.exports = {
    execute: initialisation
};