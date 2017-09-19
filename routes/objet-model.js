var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ObjetSchema = new Schema({
    nom: String,
    status: String,
    url: String,
    typeObjet: String
})

module.exports = mongoose.model('Objet', ObjetSchema);