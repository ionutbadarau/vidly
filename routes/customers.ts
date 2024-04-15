import express, { Request, Response } from 'express';
import { Customer, ICustomer, validateCustomer } from '../models/customer';
export const router = express.Router();

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

  let newCustomer = new Customer<ICustomer>({
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

  const reqData: ICustomer = {
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone
  }
  const changedCustomer = await Customer.findByIdAndUpdate(req.params.id, reqData, {
    new: true  // returns the updated record
  });
  if (!changedCustomer) return res.status(404).send(`Customer with id ${req.params.id} was not found.`);

  res.send(changedCustomer);
});

router.delete('/:id', async (req: Request, res: Response) => {
  const customerToDelete = await Customer.findByIdAndDelete(req.params.id);
  if (!customerToDelete) return res.status(404).send('The customer with given id was not found..')

  res.send(customerToDelete);
});
