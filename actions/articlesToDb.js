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
  .post(`${process.env.API_BASE_URL}/api/search/publications`)
  .send({
    country,
    'searchTerm': 'telegraph',
    'newsApiIdOrNot': true
  })
  .set('X-CORS-TOKEN', process.env.APIKEY)
  .set('Content-Type', 'application/json')
  .end((err, res) => {
    const publicationArray = res.body.results.map(publication => {
      return new Promise((resolve) => {
        const newsApiCall = `https://newsapi.org/v2/top-headlines?sources=${publication.newsApiId}&apiKey=${process.env.NEWS_APIKEY}`;

        console.log(publication.name);
        console.log(newsApiCall);
        console.log('* * * * *');

        request
          .get(newsApiCall)
          .end((err, res) => {
            resolve({
              publicationId: publication['_id'],
              res
            });
          });
      });
    });

    return Promise.all(publicationArray)
      .then((publications) => {

        publications.map(publication => {
          const { publicationId, res } = publication;

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
              const articlesToPost = articles.map(article => {
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

              return Promise.all(articlesToPost)
                .then((articles) => {
                  console.log(articles.length, ' articles added');
                });
            });
        });

      });

  });
