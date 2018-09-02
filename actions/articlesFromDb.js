require('dotenv').config();
import metadata from "html-metadata";
import request from "superagent";

import dataFilter from "../utils/dataFilter";

let country = 'United Kingdom';
switch (process.env.COUNTRY) {
  case 'au':
    country = 'Australia';
    break;
  case 'us':
    country = 'United States';
    break;
  default:
    country = 'United Kingdom';
}

request
  .post(`${process.env.API_BASE_URL}/api/search/articles`)
  .send({
    country,
    'howManyHours': process.env.HOW_MANY_HOURS
  })
  .set('X-CORS-TOKEN', process.env.APIKEY)
  .set('Content-Type', 'application/json')
  .end((err, res) => {
    const articles = res.body.results.map(article => {
      return {
        articleId: article._id,
        url: article.url
      }
    });

    const articlesArray = articles.map(article => {
      const { articleId, url } = article;

      return new Promise((resolve) => {
        metadata(url)
          .then((metadata) => {
            const {
              authors,
              description,
              locale,
              section,
              shortUrl,
              title,
              trends,
              urlToImage
            } = dataFilter(metadata);

            resolve({
              articleId,
              authors,
              description,
              locale,
              section,
              shortUrl,
              title,
              trends,
              urlToImage
            });
          });
      });
    });

    return Promise.all(articlesArray)
      .then((articles) => {
        const articlesToUpdate = articles.map(article => {
          return new Promise((resolve) => {
            request
              .post(`${process.env.API_BASE_URL}/api/create/article`)
              .send(article)
              .set('X-CORS-TOKEN', process.env.APIKEY)
              .set('Content-Type', 'application/json')
              .end((err, res) => {
                resolve(res);
              });
          });
        });

        return Promise.all(articlesToUpdate)
          .then((articles) => {
            console.log(articles.length, ' articles updated');
          });
      });

  });
