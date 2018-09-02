import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const bodyParserLimit = bodyParser.json({
  limit: '50mb'
});
const route = express.Router();

import articleModel from '../models/articleModel';
const { Author, Article, Section, Trend } = articleModel;

import options from '../constants/options';

route.post('/create/article', bodyParserLimit, (req, res) => {

  const creationDetails = {
    dateCreated: Date.now(),
    dateModified: Date.now()
  };

  const authors = req.body.authors.map(author => {
    return new Author({
      _id: new mongoose.Types.ObjectId(),
      name: author,
      prettyName: author,
      publication: req.body.publication
    })
  });

  const trends = req.body.trends.map(trend => {
    return new Trend({
      _id: new mongoose.Types.ObjectId(),
      name: trend,
      prettyName: trend
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
      return new Promise((resolve) => {

        author
          .save((existingAuthor) => {
            if (existingAuthor) resolve(existingAuthor);
            resolve(author);
          });

      }).catch(() => {
        console.log(`${author.name} exists`);
      });
    });

    return Promise.all(authorSave)
      .then(authors => {

        const trendSave = trends.map(trend => {
          return new Promise((resolve) => {

            trend
              .save((existingTrend) => {
                if (existingTrend) resolve(existingTrend);
                resolve(trend);
              });

          }).catch(() => {
            console.log(`${trend.name} exists`);
          });
        });

        return Promise.all(trendSave)
          .then(trends => {

            return new Promise((resolve) => {
              const section = new Section({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.section,
                prettyName: req.body.section
              });

              section
                .save((existingSection) => {
                  if (existingSection) resolve(existingSection);
                  resolve(section);
                });
            })
              .then(section => {
                const updatedData = Object
                  .assign(
                    req.body,
                    {
                      authors: authors
                        .filter(author => author !== undefined)
                        .map(author => author._id)
                    },
                    {
                      section: section
                    },
                    {
                      trends: trends
                        .filter(trend => trend !== undefined)
                        .map(trend => trend._id)
                    }
                  );

                if (req.body.articleId !== undefined) {
                  Article
                    .findByIdAndUpdate(req.body.articleId, updatedData, function (err) {
                      if (err) {
                        res
                          .status(500)
                          .send(err.message);
                      } else {
                        res
                          .status(200)
                          .send({
                            articleId: req.body.articleId,
                            message: "Article has been updated"
                          });
                      }
                    });
                } else {
                  const article = new Article(
                    Object
                      .assign(
                        creationDetails,
                        updatedData
                      )
                  );

                  article
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
                            message: "Article has been created"
                          });
                      }
                    });
                }
              });

          });
      });
  }

});

route.post('/retrieve/article/:articleId', bodyParserLimit, (req, res) => {

  mongoose.connect(process.env.MONGODB_URI, options, function(error) {
    if (error) {
      res
        .status(500)
        .send(error.message)
    } else {
      Article
        .findById(req.params.articleId)
        .populate('authors')
        .populate('publication')
        .populate('section')
        .populate('trends')
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

route.post('/update/article/:articleId', bodyParserLimit, (req, res) => {
  mongoose.connect(process.env.MONGODB_URI, options, function(error) {
    if (error) {
      res
        .status(500)
        .send(error.message)
    } else {
      updateArticle(req.params.articleId);
    }
  });

  function updateArticle(articleId) {
    const updatedData = (
      Object
        .assign(
          {},
          req.body
        )
    );

    Article
      .findByIdAndUpdate(articleId, updatedData, function (err) {
        if (err) {
          res
            .status(500)
            .send(err.message);
        } else {
          res
            .status(200)
            .send({
              articleId,
              message: "Article has been updated"
            });
        }
      });
  }
});

export default route;
