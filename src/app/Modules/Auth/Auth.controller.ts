import { RequestHandler } from "express";
import { authService } from "./Auth.service";


import { successResponse } from "../../Re-useable/successResponse";
import { StatusCodes } from "http-status-codes";

const singUp: RequestHandler = async (req, res, next) => {
  try {
    const result = await authService.singUpDB(req.body);
    const { accessToken, refreshToken } = result!;
    res.cookie("refreshToken", refreshToken, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    });
    res.send(
      successResponse(
        { accessToken, refreshToken },
        201,
        "User registered successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};

const signIn: RequestHandler = async (req, res, next) => {
  try {
    const result = await authService.signInDB(req.body);
    const { accessToken, refreshToken } = result!;
    res.cookie("refreshToken", refreshToken, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    });
    res.send(
      successResponse(
        { accessToken, refreshToken },
        200,
        "User logged in successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};

const refreshToken: RequestHandler = async (req, res, next) => {
  try {
    const result = await authService.refreshTokenDB(req?.cookies.refreshToken);
    res.send(
      successResponse(
        result,
       StatusCodes.OK,
        "Refresh Token send Successfully done "
      )
    );
  } catch (error) {
    next(error);
  }
};


const forgetPassword: RequestHandler = async (req, res, next) => {
  try {
    const result = await authService.forgetPasswordDB(req.body);
    res.send(
      successResponse(result, StatusCodes.OK, "Forget Password Request Done")
    );
  } catch (error) {
    next(error);
  }
};

const changePassword: RequestHandler = async (req, res, next) => {
  const token = req?.headers?.authorization;
  try {
    const result = await authService.changePasswordDB(token as string, req.body);
    res.send(
      successResponse(
        result,
        StatusCodes.OK,
        "Password Change Successfully done "
      )
    );
  } catch (error) {
    next(error);
  }
};

export const authController = {
  signIn,
  singUp,
  refreshToken,
  changePassword,
  forgetPassword,
};
