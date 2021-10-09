import { IUserDocument, IUserModel } from "./user.types";

export const findByEmailAndPassword = async (
  model: IUserModel,
  email: string,
  password: string
): Promise<IUserDocument> => {
  return model.findOne({ password: password, email: email });
};
