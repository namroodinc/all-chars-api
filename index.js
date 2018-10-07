require('dotenv').config();
import express from 'express';
import cors from 'cors';
const app = express();

import article from './routes/article';

const corsConfig = {
  methods: ['GET'],
  allowedHeaders: ['Content-Type', 'X-CORS-TOKEN']
};

app.use((req, res, next) => {
  if (req.headers['x-cors-token'] === process.env.APIKEY || req.method === 'OPTIONS') {
    next();
  } else {
    res.status(400).send('MISSING CORS HEADER');
  }
});

app.use('/api', cors(corsConfig), article);

app.listen(process.env.PORT, () => {
  console.log(
    `Server has been started on port: ${process.env.PORT}`
  )
});
