import express, { Request, Response } from 'express';
import { Genre, validateGenre } from '../models/genre';
export const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  const genres = await Genre.find().sort('name');
  res.send(genres);
});

router.get('/:id', async (req: Request, res: Response) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(404).send(`Genre with id ${req.params.id} was not found.`);
  res.send(genre);
});

router.post('/', async (req: Request, res: Response) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let newGenre = new Genre({ name: req.body.name });

  try {
    newGenre = await newGenre.save();
    res.send(newGenre);
  } catch (error: any) {
    res.status(400).send(error.message);
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const changedGenre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
    new: true  // returns the updated record
  });
  if (!changedGenre) return res.status(404).send(`Genre with id ${req.params.id} was not found.`);

  res.send(changedGenre);
});

router.delete('/:id', async (req: Request, res: Response) => {
  const genreToDelete = await Genre.findByIdAndDelete(req.params.id);

  if (!genreToDelete) return res.status(404).send('The genre with given id was not found..')

  res.send(genreToDelete);
});
