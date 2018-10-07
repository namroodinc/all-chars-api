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
    species: String
  }
));

const Character = mongoose.model('Character', characterSchema);

export default {
  Character
};
