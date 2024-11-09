import bcrypt from "bcrypt";
import AppError from "../Error-Handler/AppError";
import { StatusCodes } from "http-status-codes";

export const validateLoginPassword = async (
  plainTextPassword: string,
  hashPass: string
): Promise<boolean> => {
  try {
    const result = await bcrypt.compare(plainTextPassword, hashPass);
    return result;
  } catch (err) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Something Went Wrong !");
  }
};
