import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const dynamicTokenGenerate = (
  jwtPayload: { id: string; role: string },
  token: string,
  time: string
) => {
  return jwt.sign(
    {
      data: jwtPayload,
    },
    token as string,
    { expiresIn: time }
  );
};
