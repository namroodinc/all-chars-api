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
  const page = req.body.page;
  // const author = req.body.author;
  // const trend = req.body.trend;
  console.log(searchTerm);

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
  })
    .find({
      // 'date': { $gte: req.body.minDate, $lte: req.body.maxDate },
      // 'authors': {
      //   '$regex': new RegExp(author, 'i')
      // },
      // 'trends': {
      //   '$regex': new RegExp(trend, 'i')
      // }
    })
    .sort({
      'modified': -1
    });

  pageQuery
    .select('title description authors trends')
    .skip((page || 0) * 10)
    .limit(10);

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
            });
          }
        });
      }
    });
  }
});

export default route;
