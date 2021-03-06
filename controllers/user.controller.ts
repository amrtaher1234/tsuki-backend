import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import express from "express";
import { UserModel } from "../database/user/user.model";
import { IUserDocument } from "../database/user/user.types";

async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}
async function validatePassword(password: string, hashPassword) {
  return await bcrypt.compare(password, hashPassword);
}
export const users = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    res.send({ users: await UserModel.find({}) });
  } catch (err) {
    next(err);
  }
};
export const signup = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const { email, password, name } = req.body;
    const user = await UserModel.findOne({ email: email });
    if (user) {
      throw { error: `Email ${email} already exists`, status: 409 };
    }
    const hashedPassword = await hashPassword(password);
    const newUser = new UserModel({
      email: email,
      password: hashedPassword,
      name: name,
    });
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {});
    newUser.token = token;
    await newUser.save();
    res.status(200).send(newUser.toJSON());
  } catch (error) {
    next(error);
  }
};
export const login = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw { error: "User Not Found", status: 404 };
    }
    const validPassword = await validatePassword(password, user.password);
    if (!validPassword) {
      throw { error: "Password incorrect", status: 400 };
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    await UserModel.findByIdAndUpdate(user._id, { token });
    res.status(200).send(user.toJSON());
  } catch (error) {
    next(error);
  }
};
export const payCoins = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const coins = req.body.coins;
  try {
    const user = res.locals.loggedInUser as IUserDocument;
    if (!user) {
      throw { error: "User Not Found", status: 404 };
    }
    const newCoins = +user.coins - +coins;

    if (newCoins < 0) {
      throw { error: "Insufficient coins", status: 400 };
    }
    await (await UserModel.findByIdAndUpdate(user._id, { coins: newCoins })).save();
    res.status(200).send({
      coins: newCoins,
      status: 200,
    });
  } catch (error) {
    next(error);
  }
};
export const getCoins = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const user = res.locals.loggedInUser as IUserDocument;
    const coins = await UserModel.findById(user._id, { coins: 1, _id: 0 });
    res.status(200).send({ coins: coins.coins, status: 200 });
  } catch (err) {
    next(err);
  }
};
export const addCoins = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const { id, coins } = req.body;
    await UserModel.findByIdAndUpdate(id, { $inc: { coins: coins as never } });
    res.status(200).send({ message: "Successfully added coins" });
  } catch (error) {
    next(error);
  }
};
