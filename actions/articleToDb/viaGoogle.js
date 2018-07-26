require('dotenv').config();
import metadata from "html-metadata";
import parseDomain from "parse-domain";
import request from "superagent";
import { parseString } from "xml2js";

import dataFilter from "../../utils/dataFilter";

// console.log(process.env.NEWS_SOURCE);

request
  .post(`http://localhost:${process.env.PORT}/api/search/publications`)
  .send({
    // 'searchTerm': 'Breitbart' // has weirdly nested jsonLd/authors and other metadata // TODO:
    'searchTerm': 'Independent' // has jsonLd/author
    // 'searchTerm': 'New York Post' // has jsonLd/authors
    // 'searchTerm': 'Politico' // has schemaOrg/authors
    // 'newsApiIdOrNot': true
  })
  .set('X-CORS-TOKEN', process.env.APIKEY)
  .set('Content-Type', 'application/json')
  .end((err, res) => {

    const publicationArray = res.body.results.map(publication => {
      return new Promise((resolve) => {
        const { domain, tld } = parseDomain(publication.url);
        console.log(`${process.env.GOOGLE_NEWS_URL}/site:${domain}.${tld}`);
        request
          .get(`${process.env.GOOGLE_NEWS_URL}/site:${domain}.${tld}`)
          .buffer()
          .type('xml')
          .end((err, res) => {
            if (res.buffered) {
              parseString(res.text, (err, result) => {
                const stringifyResults = JSON.stringify(result.rss.channel[0].item, undefined, 3);

                if (stringifyResults !== undefined) {
                  resolve({
                    publicationId: publication['_id'],
                    publicationName: publication.name,
                    res: JSON.parse(stringifyResults)
                  });
                }
              });
            }
          });
      });
    });

    return Promise.all(publicationArray)
      .then((publications) => {

        publications.map(publication => {
          const { publicationId, res } = publication;

          console.log('------------------------')

          const articlesArray = res.map(article => {
            return new Promise((resolve) => {
              const { pubDate, link } = article;

              const url = link[0];

              metadata(url)
                .then((metadata) => {
                  const { authors } = dataFilter(metadata);

                  resolve({
                    authors,
                    // datePublished,
                    // description,
                    publication: publicationId,
                    // title,
                    // trends,
                    url//,
                    // urlToImage
                  });
                });
            });
          });

          return Promise.all(articlesArray)
            .then((articles) => {

              console.log(articles);

              // const articlesToPost = articles.map(article => {
              //   return new Promise((resolve) => {
              //     request
              //       .post(`http://localhost:${process.env.PORT}/api/create/article`)
              //       .send(article)
              //       .set('X-CORS-TOKEN', process.env.APIKEY)
              //       .set('Content-Type', 'application/json')
              //       .end((err, res) => {
              //         resolve(res);
              //       });
              //   })
              // });
              //
              // return Promise.all(articlesToPost)
              //   .then((articles) => {
              //     console.log(articles.length, ' articles added');
              //   });
            });
        });

      });

  });
