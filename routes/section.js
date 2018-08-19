import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import moment from 'moment';

const bodyParserLimit = bodyParser.json({
  limit: '50mb'
});
const route = express.Router();

import articleModel from '../models/articleModel';

import options from '../constants/options';

const { Article, Section } = articleModel;

route.post('/create/section', bodyParserLimit, (req, res) => {
  mongoose.connect(process.env.MONGODB_URI, options, function(error) {
    if (error) {
      res
        .status(500)
        .send(error.message)
    } else {
      saveSection(req.body.name);
    }
  });

  function saveSection(name) {
    const section = new Section({
      name,
      prettyName: name
    });

    section.save((err, mongoResponse) => {
      if (err) {
        res
          .status(500)
          .send(err.message);
      } else {
        res
          .status(200)
          .send({
            id: mongoResponse._id.toString(),
            message: "Section has been created"
          });
      }
    });
  }
});

route.post('/delete/section/:sectionId', bodyParserLimit, (req, res) => {
  mongoose.connect(process.env.MONGODB_URI, options, function(error) {
    if (error) {
      res
        .status(500)
        .send(error.message)
    } else {
      deleteSection(req.params.sectionId);
    }
  });

  function deleteSection(sectionId) {
    Section
      .findByIdAndRemove(sectionId, req.body, function (err) {
        if (err) {
          res
            .status(500)
            .send(err.message);
        } else {
          res
            .status(200)
            .send({
              sectionId,
              message: "Section has been deleted"
            });
        }
      });
  }
});

route.post('/search/sections', bodyParserLimit, (req, res) => {
  mongoose.connect(process.env.MONGODB_URI, options, function(error) {
    if (error) {
      res
        .status(500)
        .send(error.message)
    } else {
      Section
        .find({
          $or: [
            {
              'name': {
                '$regex': new RegExp(req.body.searchTerm, 'i')
              }
            }
          ]
        })
        .select('description prettyName')
        .exec(function (err, section) {
          if (err) {
            res
              .status(500)
              .send(err.message);
          } else {
            res
              .status(200)
              .send(section);
          }
        });
    }
  });

});

route.post('/retrieve/section/:sectionId', bodyParserLimit, (req, res) => {

  mongoose.connect(process.env.MONGODB_URI, options, function(error) {
    if (error) {
      res
        .status(500)
        .send(error.message)
    } else {
      Section
        .findById(req.params.sectionId)
        .exec((err, section) => {
          if (err) {
            res
              .status(500)
              .send(err.message);
          } else {
            Article
              .find({
                'section': mongoose.Types.ObjectId(req.params.sectionId)
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
                    page: section,
                    results
                  });
                }
              });
          }
        });
    }
  });

});

route.post('/update/section/:sectionId', bodyParserLimit, (req, res) => {
  mongoose.connect(process.env.MONGODB_URI, options, function(error) {
    if (error) {
      res
        .status(500)
        .send(error.message)
    } else {
      updateSection(req.params.sectionId);
    }
  });

  function updateSection(sectionId) {
    const updatedData = (
      Object
        .assign(
          {},
          req.body
        )
    );

    Section
      .findByIdAndUpdate(sectionId, updatedData, function (err) {
        if (err) {
          res
            .status(500)
            .send(err.message);
        } else {
          res
            .status(200)
            .send({
              sectionId,
              message: "Section has been updated"
            });
        }
      });
  }
});

export default route;
