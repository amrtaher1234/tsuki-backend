import express from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../database/user/user.model";
import { allowIfLoggedin } from "../utils";
import * as userController from "./../controllers/user.controller";
import validation from "./../utils/validation";
import schemas from "./../utils/validation-schemas";
const router = express.Router();

router.use(async (req, res, next) => {
  try {
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
  } catch (error) {
    console.log(error);
    if (error instanceof jwt.JsonWebTokenError) {
      next({ error: "Invalid token signature", status: 400 });
    }
    next(error);
  }
});

router.post("/signup", validation(schemas.signup), userController.signup);
router.post("/login", validation(schemas.login), userController.login);
router.post(
  "/pay-coins",
  validation(schemas.payCoins),
  allowIfLoggedin,
  userController.payCoins,
);
router.get("/get-coins", allowIfLoggedin, userController.getCoins);
router.post("/add-coins", validation(schemas.addCoins), userController.addCoins);
router.get("/", userController.users);

export default router;
