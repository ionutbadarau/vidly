import { Schema, model } from 'mongoose';
import Joi from 'joi';

import { genreSchema } from './genre';

export interface IMovie {
  title: string;
  genre: {
    _id: string,
    name: string
  };
  numberInStock?: number;
  dailyRentalRate?: number;
}

const movieSchema = new Schema({
  title: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 255
  },
  genre: {
    type: genreSchema,
    required: true,
  },
  numberInStock: {
    type: Number,
    default: 0,
    min: 0,
    max: 255
  },
  dailyRentalRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 255
  }
});

export const Movie = model('Movie', movieSchema);

export function validateMovie(movie: any) {
  const movieValidationSchema = Joi.object({
    title: Joi.string().min(5).max(50).required(),
    genreId: Joi.string().required(),
    numberInStock: Joi.number().min(0),
    dailyRentalRate: Joi.number().min(0)
  });

  return movieValidationSchema.validate({
    title: movie.title,
    genreId: movie.genreId
  });
}
