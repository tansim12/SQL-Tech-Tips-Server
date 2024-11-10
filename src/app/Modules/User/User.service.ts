import { TUser } from "./User.interface";

import { USER_ROLE, USER_STATUS, userSearchTerm } from "./User.const";
import prisma from "../../shared/prisma";
import AppError from "../../Error-Handler/AppError";
import { StatusCodes } from "http-status-codes";
import { IPaginationOptions } from "../../interface/pagination";
import { paginationHelper } from "../../helper/paginationHelper";
import { Prisma } from "@prisma/client";

const updateProfileDB = async (
  id: string,
  body: Partial<TUser>,
  tokenGetsId: string,
  tokenGetsRole: string
) => {
  // const user = await UserModel.findById(id).select("+password");
  // const tokenIdByUser = await UserModel.findById({ _id: tokenGetsId }).select(
  //   "role status isDelete"
  // );
  // if (!user) {
  //   throw new AppError(httpStatus.BAD_REQUEST, "Data Not Found !!");
  // }
  // if (user?.status === USER_STATUS.block && tokenGetsRole === USER_ROLE.user) {
  //   throw new AppError(httpStatus.BAD_REQUEST, "This User Already Blocked !!");
  // }
  // if (user?.isDelete && tokenGetsRole === USER_ROLE.user) {
  //   throw new AppError(httpStatus.BAD_REQUEST, "This User Already Delete !!");
  // }
  // if (
  //   (body?.role && tokenIdByUser?.role === USER_ROLE.user) ||
  //   (body?.status && tokenIdByUser?.role === USER_ROLE.user) ||
  //   (body?.isVerified && tokenIdByUser?.role === USER_ROLE.user) ||
  //   tokenIdByUser?.status === USER_STATUS?.block ||
  //   tokenIdByUser?.isDelete === true
  // ) {
  //   throw new AppError(
  //     httpStatus.BAD_REQUEST,
  //     "Your Can not change Role,Status and isVerified"
  //   );
  // }
  // if (body?.password) {
  //   throw new AppError(
  //     httpStatus.BAD_REQUEST,
  //     "Your Can not change password !"
  //   );
  // }
  // if (body?.email) {
  //   throw new AppError(httpStatus.BAD_REQUEST, "Your Can not change email !");
  // }
  // if (tokenGetsRole === USER_ROLE.user && tokenGetsId.toString() !== id) {
  //   throw new AppError(
  //     httpStatus.BAD_REQUEST,
  //     "Your can't change Other user info"
  //   );
  // }
  // const result = await UserModel.findByIdAndUpdate(
  //   id,
  //   {
  //     $set: {
  //       ...body,
  //     },
  //   },
  //   { upsert: true, new: true }
  // ).select("+password");
  // return result;
};

const getSingleUserDB = async (tokenUserId: string, paramsUserId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: tokenUserId,
    },
    select: {
      email: true,
      name: true,
      profilePhoto: true,
      createdAt: true,
      updatedAt: true,
      id: true,
      isDelete: true,
      isVerified: true,
      passwordChangeAt: true,
      phone: true,
      role: true,
      status: true,
      userProfile: {
        select: {
          id: true,
          bio: true,
          description: true,
        },
      },
    },
  });

  if (user?.role === USER_ROLE.user) {
    if (tokenUserId.toString() !== paramsUserId) {
      throw new AppError(StatusCodes.BAD_REQUEST, "You Can't find This User");
    }
  }

  if (user?.status === USER_STATUS.block) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "This User Is Already Blocked !"
    );
  }
  if (user?.isDelete) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "This User Is Already Delete !"
    );
  }

  return user;
};
const findAllUserDB = async (
  tokenUserId: string,
  filters: Partial<TUser>,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: tokenUserId,
    },
  });

  if (user?.status === USER_STATUS.block) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "This User Is Already Blocked !"
    );
  }
  if (user?.isDelete) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "This User Is Already Delete !"
    );
  }
  if (user?.role !== USER_ROLE.admin) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "You Can't Access This Route.Only Admin Access Here !"
    );
  }

  const andCondition = [];
  if (filters.searchTerm) {
    andCondition.push({
      OR: userSearchTerm.map((field) => ({
        [field]: {
          contains: filters.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key as never],
        },
      })),
    });
  }
  andCondition.push({
    isDelete: false,
  });
  const whereConditions = { AND: andCondition };

  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });

  const total = await prisma.user.count({
    where: whereConditions,
  });
  const meta = {
    page,
    limit,
    total,
  };
  return {
    meta,
    result,
  };
};

export const userService = {
  updateProfileDB,
  getSingleUserDB,
  findAllUserDB,
};
