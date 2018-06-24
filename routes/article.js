import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const bodyParserLimit = bodyParser.json({
  limit: '50mb'
});
const route = express.Router();

import articleModel from '../models/articleModel';
import options from '../constants/options';

const Article = articleModel.Article;

route.post('/createArticle', bodyParserLimit, (req, res) => {

  const creationDetails = {
    dateCreated: Date.now(),
    dateModified: Date.now(),
    type: req.body.type
  };

  const newArticle = new Article(
    Object
      .assign(
        creationDetails,
        req.body
      )
  );
  const updatedData = (
    Object
      .assign(
        {
          dateModified: Date.now(),
          type: req.body.type
        },
        req.body
      )
  );

  mongoose.connect(process.env.MONGODB_URI, options, function(error) {
    if (error) {
      res
        .status(500)
        .send(error.message)
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
      if (results) {
        updateArticle(id);
      } else {
        saveArticle();
      }
    });
  }

  function saveArticle() {
    newArticle
      .save(function (err, mongoResponse) {
        if (err) {
          res
            .status(500)
            .send(err.message);
        } else {
          res
            .status(200)
            .send({
              id: mongoResponse._id.toString(),
              message: "Article has been saved"
            });
        }
      });
  }

  function updateArticle(id) {
    Article
      .findByIdAndUpdate(id, updatedData, function (err) {
        if (err) {
          res
            .status(500)
            .send(err.message);
        } else {
          res
            .status(200)
            .send({
              id,
              message: "Article has been updated"
            });
        }
      });
  }
});

export default route;
