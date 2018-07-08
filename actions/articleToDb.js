require('dotenv').config();
import request from "superagent";

request
  .post(`http://localhost:${process.env.PORT}/api/search/publications`)
  .send({
    // 'searchTerm': 'The Washington Post', // TODO: Remove 'The Washington Post' after testing
    'newsApiIdOrNot': true
  })
  .set('X-CORS-TOKEN', process.env.APIKEY)
  .set('Content-Type', 'application/json')
  .end((err, res) => {

    const publicationArray = res.body.results.map(publication => {
      return new Promise((resolve) => {
        request
          .get(`https://newsapi.org/v2/top-headlines?sources=${publication.newsApiId}&apiKey=${process.env.NEWS_APIKEY}`)
          .end((err, res) => {
            resolve(res);
          });
      });
    });

    return Promise.all(publicationArray)
      .then((publications) => {

        publications.map(publication => {

          const articlesArray = publication.body.articles.map(article => {
            return new Promise((resolve) => {
              const title = encodeURIComponent(article.title.trim());

              request
                .get(`https://api.dandelion.eu/datatxt/nex/v1/?text=${title}&min_confidence=0.7&lang=en&token=${process.env.DANDELION_APIKEY}`)
                .end((err, res) => {
                  const trends = res
                    .body
                    .annotations
                    .map(annotation => annotation.title);

                  resolve({
                    title: article.title,
                    trends
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
