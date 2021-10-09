import { Schema } from "mongoose";
import { findByEmailAndPassword } from "./user.statics";

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: String,
  token: String,
  coins: { type: Number, default: 0 },
});
UserSchema.statics.findByEmailAndPassword = findByEmailAndPassword;
export default UserSchema;
