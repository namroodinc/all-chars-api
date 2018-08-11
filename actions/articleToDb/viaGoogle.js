require('dotenv').config();
import metadata from "html-metadata";
import parseDomain from "parse-domain";
import request from "superagent";
import { parseString } from "xml2js";

import dataFilter from "../../utils/dataFilter";

// console.log(process.env.NEWS_SOURCE);

request
  .post(`${process.env.API_BASE_URL}/api/search/publications`)
  .send({
    // 'searchTerm': 'Breitbart' // has weirdly nested jsonLd/authors and other metadata // TODO:
    // 'searchTerm': 'Independent', // has jsonLd/author as array
    // 'searchTerm': 'New York Post' // has jsonLd/authors
    'searchTerm': 'times' // has jsonLd/authors
    // 'searchTerm': 'Politico' // has schemaOrg/Authors
    // 'searchTerm': 'BBC', // has jsonLd/Authors
    // 'searchTerm': 'CNN' // has jsonLd/Authors
    // 'searchTerm': 'Washington Post', // has jsonLd/Authors
    // 'searchTerm': 'Australian' // TODO: DOESN'T WORK
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

          const articlesArray = res.map(article => {
            return new Promise((resolve) => {
              const { pubDate, link } = article;

              const url = link[0];

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
                    datePublished: datePublished || pubDate[0],
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
                    .post(`${process.env.API_BASE_URL}/api/create/article`)
                    .send(article)
                    .set('X-CORS-TOKEN', process.env.APIKEY)
                    .set('Content-Type', 'application/json')
                    .end((err, res) => {
                      resolve(res);
                    });
                })
              });

              return Promise.all(articlesToPost)
                .then((articles) => {
                  console.log(articles.length, ' articles added');
                });
            });
        });

      });

  });
