import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const bodyParserLimit = bodyParser.json({
  limit: '50mb'
});
const route = express.Router();

import articleModel from '../models/articleModel';
const { Author } = articleModel;

import options from '../constants/options';

route.post('/delete/author/:authorId', bodyParserLimit, (req, res) => {
  mongoose.connect(process.env.MONGODB_URI, options, function(error) {
    if (error) {
      res
        .status(500)
        .send(error.message)
    } else {
      deleteAuthor(req.params.authorId);
    }
  });

  function deleteAuthor(authorId) {
    Author
      .findByIdAndRemove(authorId, req.body, function (err) {
        if (err) {
          res
            .status(500)
            .send(err.message);
        } else {
          res
            .status(200)
            .send({
              authorId,
              message: "Author has been deleted"
            });
        }
      });
  }
});

route.post('/retrieve/author/:authorId', bodyParserLimit, (req, res) => {
  mongoose.connect(process.env.MONGODB_URI, options, function(error) {
    if (error) {
      res
        .status(500)
        .send(error.message)
    } else {
      Author
        .findById(req.params.authorId)
        .populate('publication')
        .exec((err, author) => {
          if (err) {
            res
              .status(500)
              .send(err.message);
          } else {
            res
              .status(200)
              .send(author);
          }
        });
    }
  });
});

route.post('/search/authors', bodyParserLimit, (req, res) => {
  mongoose.connect(process.env.MONGODB_URI, options, function(error) {
    if (error) {
      res
        .status(500)
        .send(error.message)
    } else {
      Author
        .find({
          $or: [
            {
              'name': {
                '$regex': new RegExp(req.body.searchTerm, 'i')
              }
            }
          ]
        })
        .populate('publication')
        .exec(function (err, author) {
          if (err) {
            res
              .status(500)
              .send(err.message);
          } else {
            res
              .status(200)
              .send(author);
          }
        });
    }
  });

});

route.post('/update/author/:authorId', bodyParserLimit, (req, res) => {
  mongoose.connect(process.env.MONGODB_URI, options, function(error) {
    if (error) {
      res
        .status(500)
        .send(error.message)
    } else {
      updateAuthor(req.params.authorId);
    }
  });

  function updateAuthor(authorId) {
    const updatedData = (
      Object
        .assign(
          {},
          req.body
        )
    );

    Author
      .findByIdAndUpdate(authorId, updatedData, function (err) {
        if (err) {
          res
            .status(500)
            .send(err.message);
        } else {
          res
            .status(200)
            .send({
              authorId,
              message: "Author has been updated"
            });
        }
      });
  }
});

export default route;
