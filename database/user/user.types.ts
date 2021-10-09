import { Document, Model } from "mongoose";

export interface IUser {
  name: string;
  token: String;
  email: String;
  password: String;
  coins: Number;
}
export interface IUserDocument extends IUser, Document {}
export interface IUserModel extends Model<IUserDocument> {
  findByEmailAndPassword: (
    model: IUserModel,
    email: string,
    password: string,
  ) => Promise<IUserDocument>;
}
