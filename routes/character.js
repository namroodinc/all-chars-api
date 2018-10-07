import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const bodyParserLimit = bodyParser.json({
  limit: '50mb'
});
const route = express.Router();

import characterModel from '../models/characterModel';
const { Character } = characterModel;

import options from '../constants/options';

route.post('/create/character', bodyParserLimit, (req, res) => {

  mongoose.connect(process.env.MONGODB_URI, options, function(error) {
    if (error) {
      res
        .status(500)
        .send(error.message)
    } else {
      saveCharacter();
    }
  });

  function saveCharacter() {
    const character = new Character(
      Object.assign(
        {
          _id: new mongoose.Types.ObjectId(),
          dateCreated: Date.now(),
          dateModified: Date.now()
        },
        req.body
      )
    );

    character
      .save((err, mongoResponse) => {
        if (err) {
          res
            .status(500)
            .send(err.message);
        } else {
          res
            .status(200)
            .send({
              id: mongoResponse._id.toString(),
              message: "Character has been created"
            });
        }
      });
  }

});

route.post('/search/characters', bodyParserLimit, (req, res) => {

  mongoose.connect(process.env.MONGODB_URI, options, function(error) {
    if (error) {
      res
        .status(500)
        .send(error.message)
    } else {
      Character
        .find({
          $or: [
            {
              'name': {
                '$regex': new RegExp(req.body.name, 'i')
              }
            }
          ]
        })
        .populate({
          path: 'allies',
          select: 'name description'
        })
        .populate({
          path: 'foes',
          select: 'name description'
        })
        .select('name description gender species')
        .exec(function (err, character) {
          if (err) {
            res
              .status(500)
              .send(err.message);
          } else {
            res
              .status(200)
              .send(character);
          }
        });
    }
  });

});

export default route;
