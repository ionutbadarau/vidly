import mongoose from 'mongoose';
import Joi from 'joi';

type GenreType = {
  name: string;
}

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

export const Genre = mongoose.model('Genre', genreSchema);

export function validateGenre(genre: GenreType) {
  const genreNameSchema = Joi.object({
    name: Joi.string().min(3).required()
  });
  return genreNameSchema.validate({ name: genre.name });
}
