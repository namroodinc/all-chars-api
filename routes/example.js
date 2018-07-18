import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const bodyParserLimit = bodyParser.json({
  limit: '50mb'
});
const route = express.Router();

import exampleModel from '../models/exampleModel';
const { Story, Person } = exampleModel;

import options from '../constants/options';

route.post('/create/example', bodyParserLimit, (req, res) => {

  const authors = req.body.authors.map((author, i) => {
    return new Person({
      _id: new mongoose.Types.ObjectId(),
      name: author,
      age: 50
    })
  });

  mongoose.connect(process.env.MONGODB_URI, options, function(error) {
    if (error) {
      res
        .status(500)
        .send(error.message)
    } else {
      saveArticle();
    }
  });

  function saveArticle() {

    const authorSave = authors.map(author => {
      return new Promise((resolve, reject) => {

        (async () => {
          let doc = await Person.findOne({
            name: author.name
          });
          console.log(doc);
          console.log(author);

          author.save((err) => {
            if (err) reject();
            resolve(author);
          });
        })();

      });
    });

    return Promise.all(authorSave)
      .then(data => {
        const story = new Story({
          title: req.body.title,
          author: data.map(data => data._id)
        });

        story.save(function (err) {
          if (err) {
            res
              .status(500)
              .send(err.message);
          } else {
            res
              .status(200)
              .send({
                message: "Story has been created"
              });
          }
        });
      })
  }
});

export default route;
