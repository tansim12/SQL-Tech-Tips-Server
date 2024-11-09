import { TUser } from "../User/User.interface";
import { TChangePassword, TSignIn } from "./Auth.interface";
import { dynamicTokenGenerate } from "./Auth.utils";
import dotenv from "dotenv";
dotenv.config();
import { USER_STATUS } from "../User/User.const";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import Bcrypt from "bcrypt";
import UserProfileModel from "../User-Profile/userProfile.model";
import { emailSender } from "../../utils/emailSender";
import AppError from "../../Error-Handler/AppError";
import { StatusCodes } from "http-status-codes";
import { validateLoginPassword } from "../../Re-useable/BcryptValidation";
import prisma from "../../shared/prisma";

const singUpDB = async (payload: any) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload?.email,
    },
  });

  if (user) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "This User Already Exists. Change Email Or Phone Number"
    );
  }
  const nPassword = await Bcrypt.hash(
    payload.password,
    Number(process.env.BCRYPT_NUMBER)
  );
  
  const newPayload = {...payload,password:nPassword}
  const result = await prisma.$transaction(async (tx) => {
    const createUser = await tx.user.create({
      data: newPayload,
    });

    const createUserProfile = await tx.userProfile.create({
      data: {
        userId: createUser?.id,
        profilePhoto: createUser?.profilePhoto,
      },
    });

     await tx.user.update({
      where: {
        id: createUserProfile?.userId as string,
      },
      data: {
        userProfile: {
          connect: { id: createUserProfile.id },
        },
      },
    });

    return createUser;
  });

  // Generate JWT tokens
  const jwtPayload = {
    id: result?.id,
    role: result?.role as string,
    isVerified: result?.isVerified,
    profilePhoto: result?.profilePhoto,
    phone: result?.phone,
    email: result?.email,
    name: result?.name,
  };

  const accessToken = dynamicTokenGenerate(
    jwtPayload,
    process.env.SECRET_ACCESS_TOKEN as string,
    process.env.SECRET_ACCESS_TOKEN_TIME as string
  );
  const refreshToken = dynamicTokenGenerate(
    jwtPayload,
    process.env.SECRET_REFRESH_TOKEN as string,
    process.env.SECRET_REFRESH_TOKEN_TIME as string
  );

  if (!accessToken) {
    throw new AppError(StatusCodes.CONFLICT, "Something Went Wrong!");
  }

  // Return the tokens
  return {
    accessToken,
    refreshToken,
  };

  // ..........................................
};

const signInDB = async (payload: TSignIn) => {
  // const { email, password } = payload;
  // const user = await UserModel.findOne({ email: email }).select("+password");
  // if (!user) {
  //   throw new AppError(404, "No Data Found");
  // }
  // const isDelete = user?.isDelete;
  // if (isDelete) {
  //   throw new AppError(StatusCodes.BAD_REQUEST, "This User Already Delete !");
  // }
  // const isBlock = user?.status;
  // if (isBlock === USER_STATUS.block) {
  //   throw new AppError(StatusCodes.BAD_REQUEST, "This User Already Blocked !");
  // }
  // const checkPassword = await validateLoginPassword(password, user?.password);
  // if (!checkPassword) {
  //   throw new AppError(
  //     StatusCodes.BAD_REQUEST,
  //     "Your Password dose not matched !!"
  //   );
  // }
  // const jwtPayload = {
  //   id: user?._id,
  //   role: user?.role as string,
  //   isVerified: user?.isVerified,
  //   profilePhoto: user?.profilePhoto,
  //   phone: user?.phone,
  //   email: user?.email,
  //   name: user?.name,
  // };
  // const accessToken = dynamicTokenGenerate(
  //   jwtPayload,
  //   process.env.SECRET_ACCESS_TOKEN as string,
  //   process.env.SECRET_ACCESS_TOKEN_TIME as string
  // );
  // const refreshToken = dynamicTokenGenerate(
  //   jwtPayload,
  //   process.env.SECRET_REFRESH_TOKEN as string,
  //   process.env.SECRET_REFRESH_TOKEN_TIME as string
  // );
  // if (!accessToken) {
  //   throw new AppError(StatusCodes.CONFLICT, "Something Went Wrong !!");
  // }
  // return {
  //   accessToken,
  //   refreshToken,
  // };
};

const refreshTokenDB = async (token: string) => {
  // if (!token) {
  //   throw new AppError(StatusCodes.UNAUTHORIZED, "You are not authorized !!!");
  // }
  // const decoded = jwt.verify(
  //   token as string,
  //   process.env.SECRET_REFRESH_TOKEN as string
  // );
  // // validation is exists
  // const { id } = (decoded as JwtPayload).data;
  // const { iat } = decoded as JwtPayload;
  // const user = await UserModel.findById(id).select("+password");
  // if (!user) {
  //   throw new AppError(StatusCodes.NOT_FOUND, "This User Not Found !");
  // }
  // // validate isExistsUserDeleted
  // const isExistsUserDeleted = user?.isDelete;
  // if (isExistsUserDeleted) {
  //   throw new AppError(StatusCodes.NOT_FOUND, "This User Already Deleted !");
  // }
  // const isExistsUserStatus = user?.status;
  // if (isExistsUserStatus === USER_STATUS?.block) {
  //   throw new AppError(StatusCodes.NOT_FOUND, "This User Blocked !");
  // }
  // const passwordChangeConvertMilliSecond =
  //   new Date(user?.passwordChangeAt as Date).getTime() / 1000;
  // const jwtIssueTime = iat as number;
  // if (passwordChangeConvertMilliSecond > jwtIssueTime) {
  //   throw new AppError(StatusCodes.UNAUTHORIZED, "You are not authorized !");
  // }
  // // implements jwt token
  // const jwtPayload = {
  //   id: user?._id,
  //   role: user?.role as string,
  // };
  // const accessToken = dynamicTokenGenerate(
  //   jwtPayload,
  //   process.env.SECRET_ACCESS_TOKEN as string,
  //   process.env.SECRET_ACCESS_TOKEN_TIME as string
  // );
  // return { accessToken };
};

const forgetPasswordDB = async (payload: TChangePassword) => {
  // const { id } = payload;
  // // validation is exists
  // const user = await UserModel.findById({ _id: id }).select("+password");
  // if (!user) {
  //   throw new AppError(StatusCodes.NOT_FOUND, "This User Not Found !");
  // }
  // // validate isExistsUserDeleted
  // const isExistsUserDeleted = user?.isDelete;
  // if (isExistsUserDeleted) {
  //   throw new AppError(StatusCodes.NOT_FOUND, "This User Already Deleted !");
  // }
  // const isExistsUserStatus = user?.status;
  // if (isExistsUserStatus === USER_STATUS?.block) {
  //   throw new AppError(StatusCodes.NOT_FOUND, "This User Blocked !");
  // }
  // const jwtPayload = {
  //   id: user?._id, // Change 'userId' to 'id'
  //   role: user?.role || "user", // Ensure role is always a string, default to 'user'
  // };
  // const resetToken = dynamicTokenGenerate(
  //   jwtPayload,
  //   process.env.SECRET_ACCESS_TOKEN as string,
  //   "10m"
  // );
  // const resetUILink = `${process.env.FRONTEND_URL}/forget-password?id=${user.id}&token=${resetToken} `;
  // await emailSender(user?.email, resetUILink);
};

const changePasswordDB = async (token: string, payload: TChangePassword) => {
  // const { email, newPassword } = payload;
  // const decoded = jwt.verify(
  //   token as string,
  //   process.env.SECRET_ACCESS_TOKEN as string
  // ) as JwtPayload; // Explicitly handle both cases
  // const { id } = decoded.data;
  // // validation is exists
  // const user = await UserModel.findById({ _id: id }).select("+password");
  // if (!user) {
  //   throw new AppError(StatusCodes.NOT_FOUND, "This User Not Found !");
  // }
  // // validate isExistsUserDeleted
  // const isExistsUserDeleted = user?.isDelete;
  // if (isExistsUserDeleted) {
  //   throw new AppError(StatusCodes.NOT_FOUND, "This User Already Deleted !");
  // }
  // const isExistsUserStatus = user?.status;
  // if (isExistsUserStatus === USER_STATUS?.block) {
  //   throw new AppError(StatusCodes.NOT_FOUND, "This User Blocked !");
  // }
  // if (user?.email !== email) {
  //   throw new AppError(
  //     StatusCodes.FORBIDDEN,
  //     "Token email and payload email dose't match !!"
  //   );
  // }
  // // updating user model needPassword change false and password bcrypt
  // const newPasswordBcrypt = await Bcrypt.hash(
  //   newPassword,
  //   Number(process.env.BCRYPT_NUMBER)
  // );
  // if (!newPasswordBcrypt) {
  //   throw new AppError(400, "Password Not Change here");
  // }
  // const result = await UserModel.findByIdAndUpdate(
  //   { _id: id },
  //   {
  //     password: newPasswordBcrypt,
  //     passwordChangeAt: new Date(),
  //   }
  // );
  // if (result) {
  //   return null;
  // } else {
  //   throw new AppError(400, "Password Not Change here");
  // }
};

export const authService = {
  signInDB,
  singUpDB,
  refreshTokenDB,
  changePasswordDB,
  forgetPasswordDB,
};
