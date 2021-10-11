import Joi from "joi";
const schemas = {
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  signup: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .required()
      .min(5)
      .max(20)
      .message(
        "Should be a password of length min of 5 characters and max of 20"
      ),
    name: Joi.string().required(),
  }),
  payCoins: Joi.object({
    coins: Joi.number().required().min(1),
  }),
};
export default schemas;
