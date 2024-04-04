import express, { Request, Response } from 'express';
export const router = express.Router();
import Joi from 'joi';

type Genre = {
  id: number;
  name: string;
}

let genres: Genre[] = [{
  id: 1,
  name: 'comedy',
}, {
  id: 2,
  name: 'drama',
}];

router.get('/', (req: Request, res: Response) => {
  res.send(genres);
});

router.get('/:id', (req: Request, res: Response) => {
  const gToSend = genres.find(g => g.id === parseInt(req.params.id));
  if (!gToSend) return res.status(404).send(`Genre with id ${req.params.id} was not found.`);
    
  res.send(gToSend);
});

router.post('/', (req: Request, res: Response) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const newGenre: Genre = {
    name: req.body.name,
    id: genres.length + 1
  }
  genres.push(newGenre);
  res.send(newGenre);
});

router.put('/:id', (req: Request, res: Response) => {
  const genreToChange = genres.find(g => g.id === parseInt(req.params.id));
  if (!genreToChange) return res.status(404).send(`Genre with id ${req.params.id} was not found.`);

  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  genreToChange.name = req.body.name;
  res.send(genreToChange);
});

router.delete('/:id', (req: Request, res: Response) => {
  const genre = genres.find(g => g.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send(`Genre with id ${req.params.id} was not found.`);

  const idx = genres.indexOf(genre);
  genres.splice(idx, 1)
  
  res.send(genre);
});

function validateGenre(genre: Genre) {
  const genreNameSchema = Joi.object({
    name: Joi.string().min(3).required()
  });
  return genreNameSchema.validate({ name: genre.name });
}
