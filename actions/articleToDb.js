require('dotenv').config();
import request from "superagent";

request
  .post(`http://localhost:${process.env.PORT}/api/search/publications`)
  .send({
    'newsApiIdOrNot': true
  })
  .set('X-CORS-TOKEN', process.env.APIKEY)
  .set('Content-Type', 'application/json')
  .end((err, res) => {

    const dataArray = res.body.results.map(publication => {
      return new Promise((resolve) => {
        request
          .get(`https://newsapi.org/v2/top-headlines?sources=${publication.newsApiId}&apiKey=${process.env.NEWS_APIKEY}`)
          .end((err, res) => {
            resolve(res);
          });
      })
    });

    return Promise.all(dataArray).then((values) => {
      values.map(value => {
        value.body.articles.map(article => {
          console.log(article.title);
        });
      });
    });

  });
