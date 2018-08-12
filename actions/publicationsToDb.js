require('dotenv').config();
import Papa from "papaparse";
import read from "read-file";
import request from "superagent";

read("./temp_files/publications.csv", (err, buffer) => {
  Papa.parse(buffer.toString('utf8'), {
    header: true,
    complete: function(results) {
      const { data } = results;

      const dataArray = data.map(publication => {
        return new Promise((resolve) => {
          request
            .post(`${process.env.API_BASE_URL}/api/create/publication`)
            .send(publication)
            .set('X-CORS-TOKEN', process.env.APIKEY)
            .set('Content-Type', 'application/json')
            .end((err, res) => {
              resolve(res);
            });
        })
      });

      return Promise.all(dataArray).then((values) => {
        console.log(`${values.length} publications added to the database.`);
      });
    }
  });
});
