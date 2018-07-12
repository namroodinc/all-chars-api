require('dotenv').config();
import metadata from "html-metadata";
import isoFetch from "isomorphic-fetch";
import parseDomain from "parse-domain";
import request from "superagent";
import { parseString } from "xml2js";
// import Sentiment from "sentiment";
// const sentiment = new Sentiment();

request
  .post(`http://localhost:${process.env.PORT}/api/search/publications`)
  .send({
    'searchTerm': 'Daily Mirror', // TODO: Remove 'The Guardian' after testing
    'newsApiIdOrNot': true
  })
  .set('X-CORS-TOKEN', process.env.APIKEY)
  .set('Content-Type', 'application/json')
  .end((err, res) => {

    const publicationArray = res.body.results.map(publication => {
      return new Promise((resolve) => {
        const { domain, tld } = parseDomain(publication.url);

        isoFetch(`${process.env.GOOGLE_NEWS_URL}/site:${domain}.${tld}`, {
          method: 'GET'
        })
          .then(response => {
            if (response.ok) return response.text();
            throw new Error(`Fetch ${domain}.${tld} failed`);
          })
          .then(body => {
            parseString(body, (err, result) => {
              const stringifyResults = JSON.stringify(result.rss.channel[0].item, undefined, 3);
              const res = JSON.parse(stringifyResults);

              resolve({
                publicationId: publication['_id'],
                res
              });
            });
          });
      });
    });

    return Promise.all(publicationArray)
      .then((publications) => {

        publications.map(publication => {
          const { publicationId, res } = publication;
          const articlesArray = res.map(article => {
            return new Promise((resolve) => {
              const { pubDate, title, link } = article;

              metadata(link[0])
                .then((metadata) => {
                  const { general, openGraph } = metadata;

                  const { author } = general;
                  const { tag } = openGraph;

                  resolve({
                    authors: author === undefined ? [] : author.split(','),
                    datePublished: pubDate[0],
                    // description,
                    publicationId,
                    // sentiment: sentimentAnalysis,
                    title: title[0],
                    trends: tag,
                    url: link[0]
                    // urlToImage
                  });
                });

            });
          });

          return Promise.all(articlesArray)
            .then((articles) => {
              console.log(articles);
            });

        });

      });

  });
