require('dotenv').config();
import metadata from "html-metadata";
import parseDomain from "parse-domain";
import request from "superagent";
import { parseString } from "xml2js";
// import Sentiment from "sentiment";
// const sentiment = new Sentiment();

// console.log(process.env.NEWS_SOURCE);

request
  .post(`http://localhost:${process.env.PORT}/api/search/publications`)
  .send({
    'searchTerm': 'New York Times'
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

                  // authors
                  let authors = author === undefined ? [] : author.split(',');
                  if (jsonLd !== undefined) if (jsonLd.author !== undefined) authors = jsonLd.author.name;

                  // datePublished
                  let datePublished = pubDate[0];
                  if (openGraph !== undefined) if (openGraph['published_time'] !== undefined) datePublished = openGraph['published_time'];

                  // description
                  let description = '';
                  if (general !== undefined) if (general.description !== undefined) description = general.description;
                  if (openGraph !== undefined) if (openGraph.description !== undefined) description = openGraph.description;
                  if (twitter !== undefined) if (twitter.description !== undefined) description = twitter.description;

                  // title
                  let title = '';
                  if (general !== undefined) if (general.title !== undefined) title = general.title;
                  if (openGraph !== undefined) if (openGraph.title !== undefined) title = openGraph.title;

                  // trends
                  const trendsList = keywords || tag || [];
                  const trends = Array.isArray(trendsList) ? trendsList : trendsList.split(',');

                  // urlToImage
                  let urlToImage = '';
                  if (openGraph !== undefined) if (openGraph.image !== undefined) urlToImage = openGraph.image.url;

                  resolve({
                    authors,
                    datePublished,
                    description,
                    publicationId,
                    // sentiment: sentiment.analyze(title),
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
