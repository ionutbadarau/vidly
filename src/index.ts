import express, { Request, Response } from 'express';
import Joi from 'joi';
import helmet from 'helmet';
import morgan from 'morgan';
const startupDebugger = require('debug')('app:startup');
// const dbDebugger = require('debug')('app:db');

const app = express();

app.use(express.json()); // this is for accepting json objects in POST body requests
app.use(express.urlencoded({ extended: true })); // this transforms key=value&key=value (x-www-form-urlencoded) into json in req.body
app.use(express.static('public')); // this is for serving static content (in public folder)
app.use(helmet()); // adds http headers to requests to make it safer

if (app.get('env') === 'development') {
  app.use(morgan('tiny')); // HTTP request logger
  startupDebugger('morgan enabled..'); // console.log replacement.. based on env variables (`set DEBUG=app:startup`)
}
// dbDebugger('db debugger texting..')

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
  if (!gToSend) return res.status(404).send(`Genre with id ${req.params.id} was not found.`);
    
  res.send(gToSend);
});

app.post('/api/genres', (req: Request, res: Response) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const newGenre: Genre = {
    name: req.body.name,
    id: genres.length + 1
  }
  genres.push(newGenre);
  res.send(newGenre);
});

app.put('/api/genres/:id', (req: Request, res: Response) => {
  const genreToChange = genres.find(g => g.id === parseInt(req.params.id));
  if (!genreToChange) return res.status(404).send(`Genre with id ${req.params.id} was not found.`);

  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  genreToChange.name = req.body.name;
  res.send(genreToChange);
});

app.delete('/api/genres/:id', (req: Request, res: Response) => {
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


const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on ${port}`));
