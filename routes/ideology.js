import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const bodyParserLimit = bodyParser.json({
  limit: '50mb'
});
const route = express.Router();

import ideologyModel from '../models/ideologyModel';
const { Ideology } = ideologyModel;

import options from '../constants/options';

route.post('/create/ideology', bodyParserLimit, (req, res) => {

  mongoose.connect(process.env.MONGODB_URI, options, function(error) {
    if (error) {
      res
        .status(500)
        .send(error.message)
    } else {
      saveIdeology();
    }
  });

  function saveIdeology() {
    const review = new Ideology({
      description: req.body.description,
      name: req.body.name
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
            message: "Ideology has been created"
          });
      }
    });
  }
});

route.post('/delete/ideology/:ideologyId', bodyParserLimit, (req, res) => {
  mongoose.connect(process.env.MONGODB_URI, options, function(error) {
    if (error) {
      res
        .status(500)
        .send(error.message)
    } else {
      deleteIdeology(req.params.ideologyId);
    }
  });

  function deleteIdeology(ideologyId) {
    Ideology
      .findByIdAndRemove(ideologyId, req.body, function (err) {
        if (err) {
          res
            .status(500)
            .send(err.message);
        } else {
          res
            .status(200)
            .send({
              ideologyId,
              message: "Ideology has been deleted"
            });
        }
      });
  }
});

route.post('/retrieve/ideology/:ideologyId', bodyParserLimit, (req, res) => {
  mongoose.connect(process.env.MONGODB_URI, options, function(error) {
    if (error) {
      res
        .status(500)
        .send(error.message)
    } else {
      Ideology
        .findById(req.params.ideologyId)
        .exec((err, ideology) => {
          if (err) {
            res
              .status(500)
              .send(err.message);
          } else {
            res
              .status(200)
              .send(ideology);
          }
        });
    }
  });
});

route.post('/search/ideologies', bodyParserLimit, (req, res) => {
  mongoose.connect(process.env.MONGODB_URI, options, function(error) {
    if (error) {
      res
        .status(500)
        .send(error.message)
    } else {
      Ideology
        .find({
          $or: [
            {
              'name': {
                '$regex': new RegExp(req.body.searchTerm, 'i')
              }
            }
          ]
        })
        .exec(function (err, ideology) {
          if (err) {
            res
              .status(500)
              .send(err.message);
          } else {
            res
              .status(200)
              .send(ideology);
          }
        });
    }
  });
});

route.post('/update/ideology/:ideologyId', bodyParserLimit, (req, res) => {
  mongoose.connect(process.env.MONGODB_URI, options, function(error) {
    if (error) {
      res
        .status(500)
        .send(error.message)
    } else {
      updateIdeology(req.params.ideologyId);
    }
  });

  function updateIdeology(ideologyId) {
    const updatedData = (
      Object
        .assign(
          {},
          req.body
        )
    );

    Ideology
      .findByIdAndUpdate(ideologyId, updatedData, function (err) {
        if (err) {
          res
            .status(500)
            .send(err.message);
        } else {
          res
            .status(200)
            .send({
              ideologyId,
              message: "Ideology has been updated"
            });
        }
      });
  }
});

export default route;
