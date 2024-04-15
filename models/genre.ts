import { Schema, model } from 'mongoose';
import Joi from 'joi';

export interface IGenre {
  name: string;
}

export const genreSchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50
  }
});

export const Genre = model('Genre', genreSchema);

export function validateGenre(genre: IGenre) {
  const genreNameSchema = Joi.object({
    name: Joi.string().min(5).max(50).required()
  });
  return genreNameSchema.validate({ name: genre.name });
}
