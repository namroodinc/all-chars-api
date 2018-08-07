import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const bodyParserLimit = bodyParser.json({
  limit: '50mb'
});
const route = express.Router();

import reviewModel from '../models/reviewModel';
const { Review } = reviewModel;

import options from '../constants/options';

route.post('/create/review', bodyParserLimit, (req, res) => {
  mongoose.connect(process.env.MONGODB_URI, options, function(error) {
    if (error) {
      res
        .status(500)
        .send(error.message)
    } else {
      saveReview();
    }
  });

  function saveReview() {
    const review = new Review({
      dateCreated: Date.now(),
      dateModified: Date.now(),
      article: req.body.articleId,
      message: req.body.message
    });

    review.save((err, mongoResponse) => {
      if (err) {
        res
          .status(500)
          .send(err.message);
      } else {
        res
          .status(200)
          .send({
            id: mongoResponse._id.toString(),
            message: "Review has been created"
          });
      }
    });
  }
});

route.post('/delete/review/:reviewId', bodyParserLimit, (req, res) => {
  mongoose.connect(process.env.MONGODB_URI, options, function(error) {
    if (error) {
      res
        .status(500)
        .send(error.message)
    } else {
      deleteReview(req.params.reviewId);
    }
  });

  function deleteReview(reviewId) {
    Review
      .findByIdAndRemove(reviewId, req.body, function (err) {
        if (err) {
          res
            .status(500)
            .send(err.message);
        } else {
          res
            .status(200)
            .send({
              reviewId,
              message: "Review has been deleted"
            });
        }
      });
  }
});

route.post('/retrieve/review/:reviewId', bodyParserLimit, (req, res) => {
  mongoose.connect(process.env.MONGODB_URI, options, function(error) {
    if (error) {
      res
        .status(500)
        .send(error.message)
    } else {
      Review
        .findById(req.params.reviewId)
        .populate({
          path: 'article',
          populate: {
            path: 'authors publication',
            populate: {
              path: 'publication',
              select: 'backgroundColor name id'
            }
          }
        })
        .exec((err, article) => {
          if (err) {
            res
              .status(500)
              .send(err.message);
          } else {
            res
              .status(200)
              .send(article);
          }
        });
    }
  });
});

route.post('/update/review/:reviewId', bodyParserLimit, (req, res) => {
  mongoose.connect(process.env.MONGODB_URI, options, function(error) {
    if (error) {
      res
        .status(500)
        .send(error.message)
    } else {
      updateReview(req.params.reviewId);
    }
  });

  function updateReview(reviewId) {
    const updatedData = {
      dateModified: Date.now(),
      message: req.body.message
    };

    Review
      .findByIdAndUpdate(reviewId, updatedData, function (err) {
        if (err) {
          res
            .status(500)
            .send(err.message);
        } else {
          res
            .status(200)
            .send({
              reviewId,
              message: "Review has been updated"
            });
        }
      });
  }
});

route.post('/search/reviews', bodyParserLimit, (req, res) => {
  mongoose.connect(process.env.MONGODB_URI, options, function(error) {
    if (error) {
      res
        .status(500)
        .send(error.message)
    } else {
      Review
        .find({
          $or: [
            {
              'message': {
                '$regex': new RegExp(req.body.searchTerm, 'i')
              }
            }
          ]
        })
        .select('dateCreated dateModified message')
        .exec(function (err, review) {
          if (err) {
            res
              .status(500)
              .send(err.message);
          } else {
            res
              .status(200)
              .send(review);
          }
        });
    }
  });

});

export default route;
