// auth.guard.ts
import type { CanActivate, ExecutionContext } from "@nestjs/common";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import type { Request } from "express";
import { IS_PUBLIC_KEY } from "../Auth/decorators/public.decorator"; // 👈 Import public key metadata
import type {
  AuthenticatedRequest,
  JwtPayload,
} from "../common/types/auth.interface";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector, // 👈 Injected Reflector to read route metadata
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Check if the route or controller handler is marked as @Public()
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 2. Skip authentication if the endpoint is public
    if (isPublic) {
      return true;
    }

    // 3. Extract request object
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException("Authentication token is missing");
    }

    try {
      // 4. Verify and decode payload
      const decodedPayload =
        await this.jwtService.verifyAsync<JwtPayload>(token);

      // 5. Attach user to request
      request.user = decodedPayload;
    } catch {
      throw new UnauthorizedException(
        "Invalid or expired authentication token",
      );
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) return undefined;

    const [authType, token] = authHeader.split(" ");
    return authType === "Bearer" ? token : undefined;
  }
}
