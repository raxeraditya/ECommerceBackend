import {
  Injectable,
  Logger,
  type OnModuleInit,
  type OnModuleDestroy,
} from "@nestjs/common";
import { PrismaClient } from "../generated/prisma/client";
import { prismaClientOptions } from "../lib/prisma";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  // 📍 Context-bound logger for PrismaService
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super(prismaClientOptions);
  }

  /**
   * Runs automatically when the NestJS application starts
   */
  async onModuleInit() {
    this.logger.log("Connecting to the database...");
    try {
      await this.$connect();
      this.logger.log("Database connection established successfully.");
    } catch (error) {
      this.logger.error(
        "Failed to connect to the database",
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  /**
   * Runs automatically when the NestJS application shuts down
   */
  async onModuleDestroy() {
    this.logger.log("Disconnecting from the database...");
    try {
      await this.$disconnect();
      this.logger.log("Database connection closed gracefully.");
    } catch (error) {
      this.logger.error(
        "Error while disconnecting from the database",
        error instanceof Error ? error.stack : undefined,
      );
    }
  }
}
