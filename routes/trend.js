import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import moment from 'moment';

import dataCount from "../utils/dataCount";

const bodyParserLimit = bodyParser.json({
  limit: '50mb'
});
const route = express.Router();

import articleModel from '../models/articleModel';
import options from '../constants/options';

const Article = articleModel.Article;

route.post('/retrieve/trends', bodyParserLimit, (req, res) => {
  const publicationId = req.body.publicationId;
  const howManyDays = req.body.howManyDays || 1;

  mongoose.connect(process.env.MONGODB_URI, options, function(error) {
    if (error) {
      res
        .status(500)
        .send(error.message)
    } else {

      const articlesQuery = Article
        .find({
          'publication': publicationId,
          'datePublished': {
            $gte: moment().subtract(howManyDays, 'day'),
            $lte: moment()
          }
        });

      articlesQuery
        .select('trends');

      articlesQuery
        .exec((err, articles) => {
          if (err) {
            res
              .status(500)
              .send(err.message);
          } else {
            res
              .status(200)
              .send({
                articlesCount: articles.length,
                trends: dataCount(articles, 'trends')
              });
          }
        });
    }
  });
});

export default route;
