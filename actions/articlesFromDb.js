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
    'howManyHours': 5
  })
  .set('X-CORS-TOKEN', process.env.APIKEY)
  .set('Content-Type', 'application/json')
  .end((err, res) => {
    console.log(res.body.results);

    return Promise.all(publicationArray)
      .then((publications) => {

        publications.map(publication => {
          const { country, publicationId, res } = publication;

          const articlesArray = res.body.articles.map(article => {
            return new Promise((resolve) => {
              const { publishedAt, url } = article;

              metadata(url)
                .then((metadata) => {
                  const {
                    authors,
                    datePublished,
                    description,
                    locale,
                    section,
                    shortUrl,
                    title,
                    trends,
                    urlToImage
                  } = dataFilter(metadata);

                  resolve({
                    authors,
                    country,
                    datePublished: datePublished || publishedAt,
                    description,
                    locale,
                    publication: publicationId,
                    section,
                    shortUrl,
                    title,
                    trends,
                    url,
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
                    .post(`${process.env.API_BASE_URL}/api/update/article`)
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

      });

  });
