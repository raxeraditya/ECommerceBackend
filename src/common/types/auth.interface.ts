import type { Request } from "express";

// 1. The data structure stored inside the JWT token string itself
export interface JwtPayload {
  sub: string; // maps to User.id
  email: string;
}

// 2. The sanitized user profile information returned to the client
export interface UserProfileResponse {
  id: string;
  name: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// 3. The complete return type response object from your Login/SignIn endpoint
export interface Response {
  access_token: string;
  User: UserProfileResponse;
}

// 4. The Request interface used across all your protected controllers
export interface AuthenticatedRequest extends Request {
  user: JwtPayload; // Guarantees req.user matches your token structure exactly
}
