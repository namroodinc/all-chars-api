require('dotenv').config();
import metadata from "html-metadata";
import request from "superagent";

import dataFilter from "../utils/dataFilter";

request
  .post(`http://localhost:${process.env.PORT}/api/search/publications`)
  .send({
    // 'searchTerm': 'cnn',
    'newsApiIdOrNot': true
  })
  .set('X-CORS-TOKEN', process.env.APIKEY)
  .set('Content-Type', 'application/json')
  .end((err, res) => {
    const publicationArray = res.body.results.map(publication => {
      return new Promise((resolve) => {
        console.log(`https://newsapi.org/v2/top-headlines?sources=${publication.newsApiId}&apiKey=${process.env.NEWS_APIKEY}`);
        request
          .get(`https://newsapi.org/v2/top-headlines?sources=${publication.newsApiId}&apiKey=${process.env.NEWS_APIKEY}`)
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
                    .post(`http://localhost:${process.env.PORT}/api/create/article`)
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
