import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const bodyParserLimit = bodyParser.json({
  limit: '50mb'
});
const route = express.Router();

import articleModel from '../models/articleModel';
const { Article } = articleModel;

import options from '../constants/options';

route.post('/search/articles', bodyParserLimit, (req, res) => {
  const searchTerm = req.body.searchTerm;
  const page = req.body.page;
  // const author = req.body.author;
  // const trend = req.body.trend;

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
      'datePublished': -1
    });

  pageQuery
    .populate('authors')
    .populate('publication')
    .select('datePublished description section title trends url')
    .skip((page || 0) * 12)
    .limit(12);

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
              page,
              results
            });
          }
        });
      }
    });
  }
});

export default route;
