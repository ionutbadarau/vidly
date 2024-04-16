import { Schema, model, Model } from 'mongoose';
import Joi from 'joi';

export interface ICustomer {
  name: string;
  isGold: boolean;
  phone: string;
}
const customerSchema = new Schema<ICustomer>({
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

export const Customer = model<ICustomer>('Customer', customerSchema);

export function validateCustomer(customer: ICustomer) {
  const customerValidationSchema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    isGold: Joi.boolean().required(),
    phone: Joi.string().min(5).max(50).required()
  });
  return customerValidationSchema.validate({
    name: customer.name,
    isGold: customer.isGold,
    phone: customer.phone
  });
}
