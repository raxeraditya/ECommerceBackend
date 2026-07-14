import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../Users/users.service";
import { LoginDto, RegisterDto } from "./dto/User.dto";
import { JwtService } from "@nestjs/jwt";
import type { JwtPayload, Response } from "../common/types/auth.interface";

@Injectable()
export class AuthService {
  // 📍 Context-bound logger for AuthService
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async loginUser(loginDto: LoginDto): Promise<Response> {
    this.logger.log(`Attempting login for user: ${loginDto.email}`);

    try {
      const user = await this.userService.findOne(loginDto);

      if (!user) {
        this.logger.warn(`Login failed: User not found (${loginDto.email})`);
        throw new UnauthorizedException("Invalid credentials");
      }

      const payload: JwtPayload = { sub: user.id, email: user.email };
      const access_token = await this.jwtService.signAsync(payload);

      this.logger.log(
        `User logged in successfully: ${user.email} (ID: ${user.id})`,
      );

      return {
        access_token,
        User: user,
      };
    } catch (error) {
      this.logger.error(
        `Error during login for email: ${loginDto.email}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  async registerUser(registerUser: RegisterDto): Promise<Response> {
    this.logger.log(`Attempting registration for email: ${registerUser.email}`);

    try {
      const user = await this.userService.create(registerUser);
      const payload: JwtPayload = { sub: user.id, email: user.email };
      const access_token = await this.jwtService.signAsync(payload);

      this.logger.log(
        `User registered successfully: ${user.email} (ID: ${user.id})`,
      );

      return {
        access_token,
        User: user,
      };
    } catch (error) {
      this.logger.error(
        `Error during user registration for email: ${registerUser.email}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }
}
