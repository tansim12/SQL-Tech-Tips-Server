import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import AppError from "../Error-Handler/AppError";
import { StatusCodes } from "http-status-codes";
import { TUserRole } from "../Modules/User/User.interface";
import prisma from "../shared/prisma";
import { UserStatus } from "@prisma/client";

dotenv.config();

const handleUnauthorizedError = (message: string, next: NextFunction) => {
  const error = new AppError(StatusCodes.UNAUTHORIZED, message);
  next(error);
};

export const authMiddleWare = (...requiredRoles: TUserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        return handleUnauthorizedError(
          "You have no access to this route",
          next
        );
      }

      const decoded = jwt.verify(
        token as string,
        process.env.SECRET_ACCESS_TOKEN as string
      ) as JwtPayload;
      const { role, id } = decoded.data;
      const { iat } = decoded;
      const user = await prisma.user.findUniqueOrThrow({
        where:{
            id
        }
      });

  
      if (user?.isDelete) {
        return next(
          new AppError(StatusCodes.BAD_REQUEST, "This User Already Deleted !")
        );
      }

      if (user?.status === UserStatus.block) {
        return next(
          new AppError(StatusCodes.BAD_REQUEST, "This User Blocked !")
        );
      }
      const passwordChangeConvertMilliSecond =
        new Date(user?.passwordChangeAt as Date).getTime() / 1000;
      const jwtIssueTime = iat as number;

      if (passwordChangeConvertMilliSecond > jwtIssueTime) {
        return next(
          new AppError(StatusCodes.UNAUTHORIZED, "You are not authorized !")
        );
      }
      if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
        return handleUnauthorizedError(
          "You have no access to this route",
          next
        );
      }
      const data = {
        id: user?.id,
        role: decoded?.data?.role,
      };
      req.user = data;
      next();
    } catch (error) {
      return handleUnauthorizedError("You have no access to this route", next);
    }
  };
};