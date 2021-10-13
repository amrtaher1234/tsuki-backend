import Joi from "joi";
const ValidationMiddleware = (schema: Joi.Schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    const valid = error == null;

    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details.map((i) => i.message).join(",");
      res.status(400).json({ error: message, status: 400 });
    }
  };
};

export default ValidationMiddleware;
