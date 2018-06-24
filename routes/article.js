const express = require('express');
const mongoose = require('mongoose');
const route = express.Router();
const bodyparser = require('body-parser');
const bodyParser = bodyparser.json({ limit: "50mb" });

const Article = require('../models/articleModel').Article;

const options = {
  autoIndex: false, // Don't build indexes
  reconnectTries: 3, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0
};

route.post('/createArticle', bodyParser, (req, res) => {

  const creationDetails = {
    dateCreated: Date.now(),
    dateModified: Date.now(),
    type: req.body.data.type
  };

  const newArticle = new Article(
    Object
      .assign(
        creationDetails,
        req.body.data
      )
  );
  const updatedData = (
    Object
      .assign(
        {
          dateModified: Date.now(),
          type: req.body.data.type
        },
        req.body.data
      )
  );

  mongoose.connect(process.env.MONGODB_URI, options, function(error) {
    if (error) {
      res.status(500).send(error.message)
    } else {
      processId(req.body.id)
    }
  });

  function processId(id) {
    if (id === '' || id === undefined) {
      saveArticle();
    } else {
      findArticle(id)
    }
  }

  function findArticle(id) {
    Article.findById(id, function (err, results) {
      if(results) {
        updateArticle(id)
      } else {
        saveArticle()
      }
    });
  }

  function saveArticle() {
    newArticle.save(function (err, mongoResponse) {
      if (err){
        res.status(500).send(err.message)
      } else {
        res.status(200).send({
          id: mongoResponse._id.toString(),
          message: "Article has been saved"
        })
      }
    });
  }

  function updateArticle(id) {
    Article.findByIdAndUpdate(id, updatedData, function (err) {
      if(err) {
        res.status(500).send(err.message)
      } else {
        res.status(200).send({
          id: id,
          message: "Article has been updated"
        })
      }
    });
  }
});

module.exports = route;
