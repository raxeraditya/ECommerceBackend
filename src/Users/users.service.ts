import {
  Injectable,
  Logger,
  UnauthorizedException,
  ConflictException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { PrismaService } from "../Prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { findUserDto } from "./dto/find-user.dto";

@Injectable()
export class UsersService {
  // 📍 Context-bound logger for UsersService
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    this.logger.log(
      `Attempting to create user with email: ${createUserDto.email}`,
    );

    try {
      // 1. Check if user exists
      const existUser = await this.prismaService.user.findFirst({
        where: {
          email: createUserDto.email,
        },
      });

      if (existUser) {
        this.logger.warn(
          `User creation failed: Email ${createUserDto.email} already exists`,
        );
        // Note: ConflictException (409) is generally better suited for duplicate resources
        throw new ConflictException("User with this email already exists");
      }

      // 2. Hash password
      const hashPassword = await bcrypt.hash(createUserDto.password, 10);

      // 3. Create user
      const user = await this.prismaService.user.create({
        data: {
          ...createUserDto,
          password: hashPassword,
        },
      });

      this.logger.log(`User created successfully with ID: ${user.id}`);

      // Strip password before returning
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      this.logger.error(
        `Error creating user for email: ${createUserDto.email}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  async findOne(findUserDto: findUserDto) {
    this.logger.log(`Searching for user with email: ${findUserDto.email}`);

    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          email: findUserDto.email,
        },
      });

      // Check if user exists
      if (!user) {
        this.logger.warn(
          `Authentication failed: User with email ${findUserDto.email} not found`,
        );
        throw new UnauthorizedException("Invalid email or password");
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(
        findUserDto.password,
        user.password,
      );

      if (!isPasswordValid) {
        this.logger.warn(
          `Authentication failed: Incorrect password for email ${findUserDto.email}`,
        );
        throw new UnauthorizedException("Invalid email or password");
      }

      this.logger.log(
        `User authenticated successfully: ${user.email} (ID: ${user.id})`,
      );

      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      this.logger.error(
        `Error finding user with email: ${findUserDto.email}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }
}
