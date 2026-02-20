import {User} from "@prisma/client";
import {prismaClient} from "../application/database";
import {ResponseError} from "../error/response-error";
import {
  RegisterRequest,
  LoginRequest,
  toAuthResponse,
  UpdateProfileRequest,
  AuthResponse,
  UpdatePasswordRequest,
} from "../models/user-model";
import {AuthValidation} from "../validations/auth-validation";
import {Validation} from "../validations/validation";
import bcrypt from "bcrypt";
import {v4 as uuid} from "uuid";
import {AuthUser} from "../types/user-request";
import {PersonValidation} from "../validations/person-validation";

export class AuthService {
  static async register(request: RegisterRequest): Promise<AuthResponse> {
    const registerRequest = Validation.validate(
      AuthValidation.REGISTER,
      request,
    );

    const totalUserWithSameEmail = await prismaClient.person.count({
      where: {
        email: registerRequest.email,
      },
    });

    if (totalUserWithSameEmail !== 0) {
      throw new ResponseError(400, "A user with this email already exists.");
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const user = await prismaClient.$transaction(async tx => {
      const newPerson = await tx.person.create({
        data: {
          fullname: registerRequest.fullname,
          email: registerRequest.email,
        },
      });

      const newUser = await tx.user.create({
        data: {
          person_id: newPerson.id,
          password: registerRequest.password,
          roles: {
            create: {
              role: {
                connectOrCreate: {
                  where: {id: 1},
                  create: {id: 1, name: "employee"},
                },
              },
            },
          },
        },
        include: {
          person: true,
          roles: {
            include: {
              role: true,
            },
          },
        },
      });

      return newUser;
    });

    return toAuthResponse(user);
  }

  static async login(request: LoginRequest): Promise<AuthResponse> {
    const loginRequest = Validation.validate(AuthValidation.LOGIN, request);

    let person = await prismaClient.person.findUnique({
      where: {
        email: loginRequest.email,
      },
      include: {
        user: true,
      },
    });

    if (!person || !person.user) {
      throw new ResponseError(401, "Invalid email or password.");
    }

    const isPasswordValid = await bcrypt.compare(
      loginRequest.password,
      person.user.password,
    );

    if (!isPasswordValid) {
      throw new ResponseError(401, "Invalid email or password.");
    }

    const user = await prismaClient.user.update({
      where: {
        id: person.user.id,
      },
      data: {
        token: uuid(),
      },
      include: {
        person: true,
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    const response = toAuthResponse(user);
    response.token = user.token!;
    return response;
  }

  static async get(user: AuthUser): Promise<AuthResponse> {
    const oneUser = await prismaClient.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        person: true,
        roles: {
          include: {role: true},
        },
      },
    });

    if (!oneUser) {
      throw new ResponseError(404, "User not found");
    }

    return toAuthResponse(oneUser);
  }

  static async updateProfil(
    user: AuthUser,
    request: UpdateProfileRequest,
  ): Promise<AuthResponse> {
    const updateRequest = Validation.validate(PersonValidation.UPDATE, request);

    if (updateRequest.email) {
      const totalUserWithSameEmail = await prismaClient.person.count({
        where: {
          email: updateRequest.email,
          NOT: {
            id: user.person_id,
          },
        },
      });

      if (totalUserWithSameEmail !== 0) {
        throw new ResponseError(400, "A user with this email already exists.");
      }
    }

    const updatedUser = await prismaClient.user.update({
      where: {
        id: user.id,
      },
      data: {
        person: {
          update: {
            email: updateRequest.email,
            fullname: updateRequest.fullname,
            birth_date: updateRequest.birth_date,
            gender: updateRequest.gender,
            phone: updateRequest.phone,
          },
        },
      },
      include: {
        person: true,
        roles: {
          include: {role: true},
        },
      },
    });

    return toAuthResponse(updatedUser!);
  }

  static async updatePassword(
    user: AuthUser,
    request: UpdatePasswordRequest,
  ): Promise<AuthResponse> {
    const updateRequest = Validation.validate(
      AuthValidation.CHANGE_PASSWORD,
      request,
    );

    const currentUser = await prismaClient.user.findUnique({
      where: {
        id: user.id,
      },
    });

    const isOldPasswordValid = await bcrypt.compare(
      updateRequest.old_password,
      currentUser!.password,
    );

    if (!isOldPasswordValid) {
      throw new ResponseError(401, "Old password is wrong");
    }

    const updatedUser = await prismaClient.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: await bcrypt.hash(updateRequest.new_password, 10),
        token: null,
      },
      include: {
        person: true,
        roles: {
          include: {role: true},
        },
      },
    });

    return toAuthResponse(updatedUser);
  }

  static async logout(user: User): Promise<AuthResponse> {
    const result = await prismaClient.user.update({
      where: {
        id: user.id,
      },
      data: {
        token: null,
      },
      include: {
        person: true,
        roles: {
          include: {role: true},
        },
      },
    });

    return toAuthResponse(result);
  }
}
