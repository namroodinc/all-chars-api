require('dotenv').config();
import express from 'express';
import cors from 'cors';
const app = express();

import article from './routes/article';
import publication from './routes/publication';
import publicationSearch from './routes/publicationSearch';

const corsConfig = {
  methods: ['GET'],
  allowedHeaders: ['Content-Type', 'X-CORS-TOKEN']
};

app.use((req, res, next) => {
  if (req.headers['x-cors-token'] === process.env.APIKEY || req.method === 'OPTIONS') {
    next();
  }
  else {
    res.status(400).send('MISSING CORS HEADER');
  }
});

app.use('/api', cors(corsConfig), article);
app.use('/api', cors(corsConfig), publication);
app.use('/api', cors(corsConfig), publicationSearch);

app.listen(process.env.PORT, () => {
  console.log(
    `Server has been started on port: ${process.env.PORT}`
  )
});
