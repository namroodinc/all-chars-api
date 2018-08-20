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

const { Article, Trend } = articleModel;

route.post('/create/trend', bodyParserLimit, (req, res) => {
  mongoose.connect(process.env.MONGODB_URI, options, function(error) {
    if (error) {
      res
        .status(500)
        .send(error.message)
    } else {
      saveTrend(req.body.name);
    }
  });

  function saveTrend(name) {
    const trend = new Trend({
      name,
      prettyName: name
    });

    trend.save((err, mongoResponse) => {
      if (err) {
        res
          .status(500)
          .send(err.message);
      } else {
        res
          .status(200)
          .send({
            id: mongoResponse._id.toString(),
            message: "Trend has been created"
          });
      }
    });
  }
});

route.post('/delete/trend/:trendId', bodyParserLimit, (req, res) => {
  mongoose.connect(process.env.MONGODB_URI, options, function(error) {
    if (error) {
      res
        .status(500)
        .send(error.message)
    } else {
      deleteTrend(req.params.trendId);
    }
  });

  function deleteTrend(trendId) {
    Trend
      .findByIdAndRemove(trendId, req.body, function (err) {
        if (err) {
          res
            .status(500)
            .send(err.message);
        } else {
          res
            .status(200)
            .send({
              trendId,
              message: "Trend has been deleted"
            });
        }
      });
  }
});

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
        .find(publicationId !== undefined ? {
          'publication': publicationId
        } : {})
        .find({
          'datePublished': {
            $gte: moment().subtract(howManyDays, 'day'),
            $lte: moment()
          }
        });

      articlesQuery
        .populate({
          path: 'trends',
          select: 'prettyName'
        });

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

route.post('/retrieve/trend/:trendId', bodyParserLimit, (req, res) => {

  mongoose.connect(process.env.MONGODB_URI, options, function(error) {
    if (error) {
      res
        .status(500)
        .send(error.message)
    } else {
      Trend
        .findById(req.params.trendId)
        .exec((err, trend) => {
          if (err) {
            res
              .status(500)
              .send(err.message);
          } else {
            Article
              .find({
                'trends': mongoose.Types.ObjectId(req.params.trendId)
              })
              .sort({
                'datePublished': -1
              })
              .populate('authors')
              .populate({
                path: 'publication',
                select: 'backgroundColor name'
              })
              .populate({
                path: 'section',
                select: 'prettyName'
              })
              .populate({
                path: 'trends',
                select: 'prettyName'
              })
              .select('datePublished description title url')
              .limit(24)
              .exec(function(err, results) {
                if (!results) {
                  res.status(200);
                } else {
                  res.status(200).send({
                    page: trend,
                    results
                  });
                }
              });
          }
        });
    }
  });

});

route.post('/update/trend/:trendId', bodyParserLimit, (req, res) => {
  mongoose.connect(process.env.MONGODB_URI, options, function(error) {
    if (error) {
      res
        .status(500)
        .send(error.message)
    } else {
      updateTrend(req.params.trendId);
    }
  });

  function updateTrend(trendId) {
    const updatedData = (
      Object
        .assign(
          {},
          req.body
        )
    );

    Trend
      .findByIdAndUpdate(trendId, updatedData, function (err) {
        if (err) {
          res
            .status(500)
            .send(err.message);
        } else {
          res
            .status(200)
            .send({
              trendId,
              message: "Trend has been updated"
            });
        }
      });
  }
});

export default route;
