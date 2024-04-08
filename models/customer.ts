import mongoose from 'mongoose';
import Joi from 'joi';

type CustomerType = {
  name: string;
  isGold: boolean;
  phone: string;
}

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50
  },
  isGold: {
    type: Boolean,
    required: true,
    default: false
  },
  phone: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50
  }
});

export const Customer = mongoose.model('Customer', customerSchema);

export function validateCustomer(customer: CustomerType) {
  const customerValidationSchema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    isGold: Joi.boolean()
  });
  return customerValidationSchema.validate({ name: customer.name });
}
