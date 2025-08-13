import {prismaClient} from "../application/database";
import {ResponseError} from "../error/response-error";
import {Pageable} from "../models/page";
import {
  SearchUserRequest,
  toUserResponse,
  UserResponse,
} from "../models/user-model";
import {UserValidation} from "../validations/user-validation";
import {Validation} from "../validations/validation";

export class UserService {
  static async get(id: number): Promise<UserResponse> {
    const result = await prismaClient.user.findFirst({
      where: {
        id: id,
      },
    });
    if (!result) {
      throw new ResponseError(404, "User not exist.");
    }

    return toUserResponse(result);
  }

  static async search(
    request: SearchUserRequest
  ): Promise<Pageable<UserResponse>> {
    const searchRequest = Validation.validate(UserValidation.SEARCH, request);
    const skip = (searchRequest.page - 1) * searchRequest.size;

    const result = await prismaClient.user.findMany({
      where: {
        name: searchRequest.name,
      },
      take: searchRequest.size,
      skip: skip,
    });

    const total = await prismaClient.user.count({
      where: {
        name: searchRequest.name,
      },
    });

    return {
      data: result.map(user => toUserResponse(user)),
      paging: {
        current_page: searchRequest.page,
        total_page: Math.ceil(total / searchRequest.size),
        size: searchRequest.size,
      },
    };
  }
}
