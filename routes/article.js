import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const bodyParserLimit = bodyParser.json({
  limit: '50mb'
});
const route = express.Router();

import articleModel from '../models/articleModel';
const { Author, Article } = articleModel;

import options from '../constants/options';

route.post('/create/article', bodyParserLimit, (req, res) => {

  const creationDetails = {
    dateCreated: Date.now(),
    dateModified: Date.now()
  };

  const newAuthors = req.body.authors.map(author => {
    return new Author({
      _id: new mongoose.Types.ObjectId(),
      name: author
    })
  });

  const newArticle = new Article(
    Object
      .assign(
        creationDetails,
        req.body,
        {
          authors: newAuthors.map(a => a)
        }
      )
  );
  const updatedData = (
    Object
      .assign(
        {
          dateModified: Date.now()
        },
        req.body,
        {
          authors: newAuthors.map(a => a)
        }
      )
  );

  mongoose.connect(process.env.MONGODB_URI, options, function(error) {
    if (error) {
      res
        .status(500)
        .send(error.message)
    } else {
      processId(req.body.id);
    }
  });

  function processId(id) {
    if (id === '' || id === undefined) {
      saveArticle();
    } else {
      findArticle(id);
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
              message: "Article has been created"
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
