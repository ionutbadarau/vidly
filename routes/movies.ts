import express, { Request, Response } from 'express';
import { IMovie, Movie, validateMovie } from '../models/movie';
import { Genre } from '../models/genre';

export const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  const movies = await Movie.find().sort('title');
  res.send(movies);
});

router.get('/:id', async (req: Request, res: Response) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).send(`The movie with given id was not found...`);
  res.send(movie);
});

router.post('/', async (req: Request, res: Response) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('Invalid genre.');

  let newMovie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name
    },
    dailyRentalRate: req.body.dailyRentalRate,
    numberInStock: req.body.numberInStock,
  });

  try {
    newMovie = await newMovie.save();

    res.send(newMovie);
  } catch (error: any) {
    res.status(400).send(error.message);
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('Invalid genre.');

  // this should be done by update, but it doesn't work
  const delMovie = await Movie.findByIdAndDelete(req.params.id);
  if (!delMovie) return res.status(404).send('The movie with the given ID was not found.');

  let newMovie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name
    },
    dailyRentalRate: req.body.dailyRentalRate,
    numberInStock: req.body.numberInStock,
  });

  try {
    newMovie = await newMovie.save();

    res.send(newMovie);
  } catch (error: any) {
    res.status(400).send(error.message);
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  const movieToDelete = await Movie.findByIdAndDelete(req.params.id);
  if (!movieToDelete) return res.status(404).send('The movie with given id was not found..')

  res.send(movieToDelete);
});
