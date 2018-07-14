require('dotenv').config();
import metadata from "html-metadata";
import parseDomain from "parse-domain";
import request from "superagent";
import { parseString } from "xml2js";
// import Sentiment from "sentiment";
// const sentiment = new Sentiment();

request
  .post(`http://localhost:${process.env.PORT}/api/search/publications`)
  .send({
    'searchTerm': 'The New Yorker'
    // 'newsApiIdOrNot': true
  })
  .set('X-CORS-TOKEN', process.env.APIKEY)
  .set('Content-Type', 'application/json')
  .end((err, res) => {

    const publicationArray = res.body.results.map(publication => {
      return new Promise((resolve) => {
        const { domain, tld } = parseDomain(publication.url);

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
                  const { general, jsonLd, openGraph, twitter } = metadata;

                  const { author, keywords } = general;
                  const { tag } = openGraph;

                  const authors = author === undefined ? [] : author.split(',');

                  const datePublished = openGraph['published_time'] || pubDate[0];
                  const description = twitter.description || openGraph.description || general.description;

                  const title = openGraph.title || general.title;
                  const trendsList = keywords || tag || [];
                  const trends = Array.isArray(trendsList) ? trendsList : trendsList.split(',');

                  const urlToImage = openGraph.image.url || '';

                  resolve({
                    authors: jsonLd.author.name || authors,
                    datePublished,
                    description,
                    publicationId,
                    // sentiment: sentimentAnalysis,
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
              console.log(articles);
            });
        });

      });

  });
