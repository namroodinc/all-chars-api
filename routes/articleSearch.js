import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const bodyParserLimit = bodyParser.json({
  limit: '50mb'
});
const route = express.Router();

import articleModel from '../models/articleModel';
import options from '../constants/options';

const Article = articleModel.Article;

route.post('/search', bodyParserLimit, (req, res) => {
  // const searchTerm = req.body.searchTerm;


});
