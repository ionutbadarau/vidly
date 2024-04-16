import { Model, Schema, Types, model } from 'mongoose';
import Joi from 'joi';

import { genreSchema } from './genre';

interface IMovieRequest {
  title: string;
  genreId: string;
  numberInStock?: number;
  dailyRentalRate?: number;
}

// Create the genre interface here (not in genre.ts)
// because I maybe don't want to store all the genre properties
// in my `genre` subdocument. 
interface IMovieGenre {
  _id: Types.ObjectId;
  name: string;
}

export interface IMovie {
  title: string;
  genre: IMovieGenre;
  numberInStock?: number;
  dailyRentalRate?: number;
}

type MovieModelType = Model<IMovie>;

const movieSchema = new Schema<IMovie, MovieModelType>({
  title: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 255
  },
  genre: new Schema<IMovieGenre>({ name: String }),
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

export const Movie = model<IMovie, MovieModelType>('Movie', movieSchema);

export function validateMovie(movie: IMovieRequest) {
  const movieValidationSchema = Joi.object({
    title: Joi.string().min(5).max(255).required(),
    genreId: Joi.string().required(), // genreId not genre, because the request will be made with the gerneId
    numberInStock: Joi.number().min(0).max(255),
    dailyRentalRate: Joi.number().min(0).max(255),
  });

  return movieValidationSchema.validate({
    title: movie.title,
    genreId: movie.genreId,
    numberInStock: movie.numberInStock,
    dailyRentalRate: movie.dailyRentalRate
  });
}
