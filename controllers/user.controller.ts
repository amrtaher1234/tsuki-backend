import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import express from "express";
import { UserModel } from "../database/user/user.model";
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
  console.log("users");
  res.send({ users: await UserModel.find({}) });
};
export const user = async (req: express.Request, res: express.Response) => {
  res.send({ user: await UserModel.findById(req.params.id) });
};
export const signup = async function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  let errorMessage = "";
  try {
    const { email, password, name } = req.body;
    const user = await UserModel.findOne({ email: email });
    if (user) {
      errorMessage = `Email ${email} already exists`;
      throw new Error(errorMessage);
    }
    const hashedPassword = await hashPassword(password);
    const newUser = new UserModel({
      email: email,
      password: hashedPassword,
      name: name,
    });
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "20d",
    });
    newUser.token = token;
    await newUser.save();
    res.send({ data: newUser, token: token });
  } catch (error) {
    res.status(404).send({ message: errorMessage, status: 404 });
  }
};

export const login = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  let errorMessage = "";
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      errorMessage = "Email not found";
      throw new Error(errorMessage);
    }
    const validPassword = await validatePassword(password, user.password);
    console.log(validPassword);
    if (!validPassword) {
      errorMessage = "Password not correct";
      throw new Error(errorMessage);
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    await UserModel.findByIdAndUpdate(user._id, { token });
    res.status(200).json({
      data: {
        email: user.email,
        name: user.name,
        _id: user._id,
      },
      token: token,
    });
  } catch (error) {
    res.status(404).send({ message: errorMessage, status: 404 });
  }
};

export const addUserCoins = async (req: express.Request, res: express.Response) => {
  const id = req.body.id;
  const coins = Number(req.body.coins) as never;
  try {
    const user = await UserModel.findById(id);
    if (!user) {
      console.log("here");
      throw Error(`User not found`);
    }
    await user.update({ $inc: { coins: coins } });
    await user.save();
    res
      .status(200)
      .send({ data: { ...user.toJSON(), coins: user.coins + coins }, status: 200 });
  } catch (error) {
    res.status(400).send({ error: error, status: 400 });
  }
};
