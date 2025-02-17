import {prismaClient} from "../application/database";
import {ResponseError} from "../error/response-error";
import {
  CreateUserRequest,
  LoginUserRequest,
  toUserResponse,
  UpdateUserRequest,
  UserResponse,
} from "../model/user-model";
import {UserValidation} from "../validation/user-validation";
import {Validation} from "../validation/validation";
import bcrypt from "bcrypt";
import {v4 as uuid} from "uuid";
import {User} from "@prisma/client";

export class UserService {
  static async register(request: CreateUserRequest): Promise<UserResponse> {
    const registerRequest = Validation.validate(
      UserValidation.REGISTER,
      request
    );

    const totalUserWithSameEmail = await prismaClient.user.count({
      where: {
        email: registerRequest.email,
      },
    });

    if (totalUserWithSameEmail !== 0) {
      throw new ResponseError(409, "Email is already taken.");
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const user = await prismaClient.user.create({
      data: {id: uuid(), ...registerRequest, role: "APPLICANT"},
    });

    return toUserResponse(user);
  }

  static async login(request: LoginUserRequest): Promise<UserResponse> {
    const loginRequest = Validation.validate(UserValidation.LOGIN, request);
    let user = await prismaClient.user.findUnique({
      where: {
        email: loginRequest.email,
      },
    });

    if (!user) {
      throw new ResponseError(403, "User with this email didn't exists.");
    }

    const isPasswordValid = await bcrypt.compare(
      loginRequest.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new ResponseError(404, "Invalid email or password.");
    }

    user = await prismaClient.user.update({
      where: {
        email: loginRequest.email,
      },
      data: {
        token: uuid(),
      },
    });

    const response = toUserResponse(user);
    response.token = user.token!;
    return response;
  }

  static async get(user: User): Promise<UserResponse> {
    return toUserResponse(user);
  }

  static async update(
    user: User,
    request: UpdateUserRequest
  ): Promise<UserResponse> {
    const updateRequest = Validation.validate(UserValidation.UPDATE, request);

    if (updateRequest.email) {
      const existingUser = await prismaClient.user.findUnique({
        where: {
          email: updateRequest.email,
        },
      });
      if (existingUser && existingUser.id !== user.id) {
        throw new ResponseError(409, "Email is already taken.");
      }
      user.email = updateRequest.email;
    }

    if (updateRequest.password) {
      user.password = await bcrypt.hash(updateRequest.password, 10);
    }

    if (updateRequest.name) {
      user.name = updateRequest.name;
    }

    const result = await prismaClient.user.update({
      where: {
        id: user.id,
      },
      data: user,
    });

    return toUserResponse(result);
  }

  static async logout(user: User): Promise<UserResponse> {
    const result = await prismaClient.user.update({
      where: {
        id: user.id,
      },
      data: {
        token: null,
      },
    });
    return toUserResponse(result);
  }
}
