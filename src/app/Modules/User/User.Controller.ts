import { RequestHandler } from "express";


import { userService } from "./User.service";
import { StatusCodes } from "http-status-codes";
import { successResponse } from "../../Re-useable/successResponse";
import pick from "../../shared/pick";
import { userSearchTerm } from "./User.const";
const updateProfile: RequestHandler = async (req, res, next) => {
  const tokenGetsId = req?.user?.id;
  const userId = req?.params?.userId;

  try {
    const result = await userService.updateProfileDB(
      userId,
      req?.body,
      tokenGetsId,
      req.user?.role
    );
    res
      .status(201)
      .send(
        successResponse(result, StatusCodes.OK, "User registered successfully")
      );
  } catch (error) {
    next(error);
  }
};
const getSingleUser: RequestHandler = async (req, res, next) => {
  const tokenGetsId = req?.user?.id;
  const userId = req?.params?.userId;

  try {
    const result = await userService.getSingleUserDB(tokenGetsId, userId);
    res
      .status(201)
      .send(
        successResponse(result, StatusCodes.OK, "User Find Successfully Done")
      );
  } catch (error) {
    next(error);
  }
};
const findAllUser: RequestHandler = async (req, res, next) => {
  const filters = pick(req.query, userSearchTerm);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const tokenGetsId = req?.user?.id;
  try {
    const result = await userService.findAllUserDB(tokenGetsId, filters,options);
    res
      .status(201)
      .send(
        successResponse(
          result,
          StatusCodes.OK,
          "All User Find Successfully Done"
        )
      );
  } catch (error) {
    next(error);
  }
};

export const userController = {
  updateProfile,
  getSingleUser,
  findAllUser,
};
