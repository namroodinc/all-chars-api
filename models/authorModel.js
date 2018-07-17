import mongoose from 'mongoose';

const modelSchema = mongoose.Schema({
  dateCreated: Number,
  dateModified: Number,
  datePublished: String,
  name: String,
  publicationId: String
});

const Author = mongoose.model('Author', modelSchema);
export default {
  Author
};
