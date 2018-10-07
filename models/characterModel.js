import mongoose from 'mongoose';
const Schema = mongoose.Schema;

import genericSchema from '../constants/genericSchema';

const characterSchema = Schema(Object.assign(
  {},
  genericSchema,
  {
    allies: [{
      type: Schema.Types.ObjectId,
      ref: 'Character'
    }],
    foes: [{
      type: Schema.Types.ObjectId,
      ref: 'Character'
    }],
    gender: String,
    species: {
      type: String,
      default: 'Human'
    },
    origin: String,
    living: {
      type: Boolean,
      default: true
    }
  }
));

const Character = mongoose.model('Character', characterSchema);

export default {
  Character
};
