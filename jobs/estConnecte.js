var request = require('request');
const Objet = require('../objet-model');

var actualiserStatus = function () {
    Objet.find(function (err, objets) {
        objets.forEach((objet) => {
            request.get({
                url: "http://" + objet.url + ":3000/status",
            }, function (err, httpResponse, body) {
                if (err) {
                    objet.set("enLigne", false);
                } else {
                    objet.set("enLigne", true);
                    var status = JSON.parse(body).status,
                        tmp_status;
                    if (status) {
                        tmp_status = "On"
                    } else {
                        tmp_status = "Off"
                    }
                    if (tmp_status != objet.status) {
                        objet.set("status", tmp_status);
                    }
                }
                objet.save((err) => {
                    if (err) console.log(err);
                });
            });
        })
    });

}

module.exports = {
    execute: function () {
        var minutes = 1,
            periode = minutes * 60 * 1000;
        actualiserStatus();
        setInterval(actualiserStatus, periode);
    },
    miseAJourStatus: () => actualiserStatus()
};
