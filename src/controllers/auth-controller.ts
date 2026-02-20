import {Request, Response, NextFunction} from "express";
import {
  LoginRequest,
  RegisterRequest,
  UpdatePasswordRequest,
  UpdateProfileRequest,
} from "../models/user-model";
import {AuthService} from "../services/auth-service";
import {UserRequest} from "../types/user-request";

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const request: RegisterRequest = req.body as RegisterRequest;
      await AuthService.register(request);
      res.status(201).json({
        message: "User registered successfully. Please login.",
      });
    } catch (err) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const request: LoginRequest = req.body as LoginRequest;
      const response = await AuthService.login(request);
      res.status(200).json({
        message: "Login successfully",
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }

  static async get(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const response = await AuthService.get(req.user!);
      res.status(200).json({
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateProfile(
    req: UserRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const request: UpdateProfileRequest = req.body as UpdateProfileRequest;
      const response = await AuthService.updateProfil(req.user!, request);
      res.status(200).json({
        message: "Profile updated successfully",
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }

  static async updatePassword(
    req: UserRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const request: UpdatePasswordRequest = req.body as UpdatePasswordRequest;
      await AuthService.updatePassword(req.user!, request);
      res.status(200).json({
        message: "Password updated successfully",
      });
    } catch (err) {
      next(err);
    }
  }

  static async logout(req: UserRequest, res: Response, next: NextFunction) {
    try {
      await AuthService.logout(req.user!);
      res.status(200).json({
        message: "Logged out successfully",
      });
    } catch (err) {
      next(err);
    }
  }
}
