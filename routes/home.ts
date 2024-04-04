import express, { Request, Response } from 'express';
export const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.render('index', { title: 'Vidly app', message: 'home page text' });
});