const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Objet = require('../objet-model');
const actualiserStatus = require('../jobs/centrale');

router.get('/', (req, res) => {
  //actualiserStatus.execute();
  Objet.find(function (err, objets) {
    if (err)
      res.send(err)
    res.json(objets);
  });
});

router.post('/', (req,res) => {
  objet = new Objet({
    nom: req.body.nouvel_Objet.nom, 
    status: req.body.nouvel_Objet.status,
    url: req.body.nouvel_Objet.url,
    typeObjet: req.body.nouvel_Objet.typeObjet
  });

  //actualiserStatus.execute();

  objet.save(function(err){
    if(err) res.send(err)
    res.json({ok:'200'});
  });
});

router.put('/:objet_id', (req,res) => {
  Objet.findById(req.params.objet_id, function (err, objet) {
    if (err) res.send(err);
    
    objet.nom = req.body.objet.nom, 
    objet.url = req.body.objet.url,

    objet.save(function (err) {
      if (err) res.send(err);
      res.json({ok:'200'});
    });
  });
})

router.delete('/:objet_id', (req,res) => {
  Objet.findById(req.params.objet_id, function(err, objet){
    if (err) res.send(err)
    if(objet === null) res.send('empty tab');
    objet.remove();
    res.json({ok: '200'});
  });
});

module.exports = router;