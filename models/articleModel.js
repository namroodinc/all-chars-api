const mongoose = require('mongoose');

const modelSchema = mongoose.Schema({
  dateCreated: Number,
  dateModified: Number,
  body: mongoose.Schema.Types.Mixed,
  type: String
});

const Article = mongoose.model('Article', modelSchema);

module.exports = {
  Article
};
