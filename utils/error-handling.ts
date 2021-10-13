export function errorLogger(error, req, res, next) {
  console.error(error);
  next(error);
}

export function errorResponder(error, req, res, next) {
  if (error && error.status && error.error) {
    res.status(error.status).send(error);
  } else {
    res.status(500).send({});
  }
}
