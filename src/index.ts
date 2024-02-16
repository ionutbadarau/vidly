import express, { Request, Response } from 'express';
import Joi from 'joi';

const app = express();
app.use(express.json()); // this is for accepting json objects in POST body requests

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

app.get('/', (req: Request, res: Response) => {
  res.send('Helo vidly');
});

app.get('/api/genres', (req: Request, res: Response) => {
  res.send(genres);
});

app.get('/api/genres/:id', (req: Request, res: Response) => {
  const gToSend = genres.find(g => g.id === parseInt(req.params.id));
  if (!gToSend) res.status(404).send(`Genre with id ${req.params.id} was not found.`);
  res.send(gToSend);
});

app.post('/api/genres', (req: Request, res: Response) => {
  const genreNameSchema = Joi.object({
    name: Joi.string().min(3).required()
  });
  const result = genreNameSchema.validate({ name: req.body.name });

  if (result.error) res.status(400).send(result.error.details[0].message);
  const newGenre: Genre = {
    name: req.body.name,
    id: genres.length + 1
  }
  genres.push(newGenre);
  res.send(newGenre);
});
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on ${port}`));
