import express from "express";

export const allowIfLoggedin = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const user = res.locals.loggedInUser;
    if (!user) {
      return res.status(401).json({
        error: "You need to be logged in to access this route",
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};
