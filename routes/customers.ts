import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
export const router = express.Router();
import Joi from 'joi';

type CustomerType = {
  name: string;
  isGold: boolean;
  phone: string;
}

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  isGold: {
    type: Boolean,
    required: true,
    default: false
  },
  phone: String
});

const Customer = mongoose.model('Customer', customerSchema);

router.get('/', async (req: Request, res: Response) => {
  const customers = await Customer.find().sort('name');
  res.send(customers);
});

router.get('/:id', async (req: Request, res: Response) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).send(`Customer with id ${req.params.id} was not found.`);
  res.send(customer);
});

router.post('/', async (req: Request, res: Response) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let newCustomer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone
  });

  try {
    newCustomer = await newCustomer.save();
    res.send(newCustomer);
  } catch (error: any) {
    res.status(400).send(error.message);
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const changedCustomer = await Customer.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone
  }, {
    new: true  // returns the updated record
  });
  if (!changedCustomer) return res.status(404).send(`Customer with id ${req.params.id} was not found.`);

  res.send(changedCustomer);
});

router.delete('/:id', async (req: Request, res: Response) => {
  const customerToDelete = await Customer.findByIdAndDelete(req.params.id);

  if (!customerToDelete) return res.status(404).send('The genre with given id was not found..')

  res.send(customerToDelete);
});

function validateCustomer(customer: CustomerType) {
  const genreNameSchema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  return genreNameSchema.validate({ name: customer.name });
}
