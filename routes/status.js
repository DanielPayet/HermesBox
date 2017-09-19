const express = require('express');
const router = express.Router();
const request = require('request');
const mongoose = require('mongoose');
const Objet = require('./objet-model');

router.put('/:ctrl_id', function (req, res) {
  
  Objet.findById(req.params.ctrl_id,  function(err, objet){
    if (err) res.send(err)
    
    objet.status = req.body.status;

    objet.save(function(err){
      if(err) res.send(err)
      res.json(objet);
    });
  });

});

module.exports = router;