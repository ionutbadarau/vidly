import express, { Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
const startupDebugger = require('debug')('app:startup');
import { router as appRouter } from '../routes/home';
import { router as genresRouter } from '../routes/genres';
import { router as customersRouter } from '../routes/customers';
// const dbDebugger = require('debug')('app:db');
import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost/vidly')
  .then(() => console.log('connected to MongoDb...'))
  .catch(err => console.error('Could not connect to MongoDb...'));

const app = express();

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.json()); // this is for accepting json objects in POST body requests
app.use(express.urlencoded({ extended: true })); // this transforms key=value&key=value (x-www-form-urlencoded) into json in req.body
app.use(express.static('public')); // this is for serving static content (in public folder)
app.use(helmet()); // adds http headers to requests to make it safer

app.use('/', appRouter);
app.use('/api/genres', genresRouter);
app.use('/api/customers', customersRouter);

if (app.get('env') === 'development') {
  app.use(morgan('tiny')); // HTTP request logger
  startupDebugger('morgan enabled..'); // console.log replacement.. based on env variables (`set DEBUG=app:startup`)
}
// dbDebugger('db debugger texting..')

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on ${port}`));
