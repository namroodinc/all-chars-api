import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ideologySchema = Schema({
  description: String,
  name: String,
  weighting: {
    type: Number,
    default: 0
  }
});

const Ideology = mongoose.model('Ideology', ideologySchema);

export default {
  Ideology
};
