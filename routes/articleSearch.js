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

route.post('/search/articles', bodyParserLimit, (req, res) => {
  const searchTerm = req.body.searchTerm;

  const idQuery = Article.findById({
    _id: searchTerm
  });

  const pageQuery = Article.find({
    $or: [
      {
        'title': {
          '$regex': new RegExp(searchTerm, 'i')
        }
      }
    ]
  });

  pageQuery
    .select('title description authors trends');

  mongoose.connect(process.env.MONGODB_URI, options, function(error) {
    if(error) {
      res.status(500).send(error.message)
    } else {
      findByID();
    }
  });

  function findByID() {
    idQuery.exec(function(err, results) {
      if (!results) {
        findBySearchTerm();
      } else {
        res.status(200).send({
          results: [results]
        });
      }
    })
  }

  function findBySearchTerm() {
    pageQuery.exec(function(err, pageResults) {
      if (!pageResults) {
        res.status(200);
      } else {
        pageQuery.exec(function(err, results) {
          if (!results) {
            res.status(200);
          } else {
            res.status(200).send({
              results
            })
          }
        })
      }
    })
  }
});

export default route;
