import express from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../database/user/user.model";
import * as userController from "./../controllers/user.controller";
const router = express.Router();

router.use(async (req, res, next) => {
  if (req.headers["x-access-token"]) {
    const token = req.headers["x-access-token"];
    const { userId, exp } = jwt.verify(token as string, process.env.JWT_SECRET) as any;
    if (exp < Date.now().valueOf() / 1000) {
      return res.status(401).json({
        error: "JWT token has expired, please login to obtain a new one",
      });
    }
    const loggedUser = await UserModel.findById(userId);
    res.locals.loggedInUser = loggedUser;
    next();
  } else {
    next();
  }
});

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/add-coins", userController.addUserCoins);
router.get("/", userController.users);

export default router;
