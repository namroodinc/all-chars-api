import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const bodyParserLimit = bodyParser.json({
  limit: '50mb'
});
const route = express.Router();

import articleModel from '../models/articleModel';
import publicationModel from '../models/publicationModel';

import options from '../constants/options';

const { Article } = articleModel;
const { Publication } = publicationModel;

route.post('/create/publication', bodyParserLimit, (req, res) => {

  const creationDetails = {
    dateCreated: Date.now(),
    dateModified: Date.now()
  };

  const newPublication = new Publication(
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
          dateModified: Date.now()
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
      savePublication();
    } else {
      findPublication(id)
    }
  }

  function findPublication(id) {
    Publication.findById(id, function (err, results) {
      if (results) {
        updatePublication(id);
      } else {
        savePublication();
      }
    });
  }

  function savePublication() {
    newPublication
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
              message: "Publication has been created"
            });
        }
      });
  }

  function updatePublication(id) {
    Publication
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
              message: "Publication has been updated"
            });
        }
      });
  }
});

route.post('/retrieve/publication/:publicationId', bodyParserLimit, (req, res) => {

  mongoose.connect(process.env.MONGODB_URI, options, function(error) {
    if (error) {
      res
        .status(500)
        .send(error.message)
    } else {
      Publication
        .findById(req.params.publicationId)
        .populate({
          path: 'ideology',
          select: 'description name'
        })
        .exec((err, publication) => {
          if (err) {
            res
              .status(500)
              .send(err.message);
          } else {
            Article
              .find({
                'publication': mongoose.Types.ObjectId(req.params.publicationId)
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
                    page: publication,
                    results
                  });
                }
              });
          }
        });
    }
  });

});

export default route;
