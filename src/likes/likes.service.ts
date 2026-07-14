// src/likes/likes.service.ts
import {
  Injectable,
  Logger,
  NotFoundException,
  HttpException, // 👈 1. Import HttpException
} from "@nestjs/common";
import { PrismaService } from "../Prisma/prisma.service";
import type { ToggleActivityResponse } from "../common/types/activity.types";

@Injectable()
export class LikesService {
  // 📍 Context-bound logger for LikesService
  private readonly logger = new Logger(LikesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async toggleLike(
    userId: string,
    productId: string,
  ): Promise<ToggleActivityResponse> {
    this.logger.log(
      `Toggling like for User ID: ${userId} on Product ID: ${productId}`,
    );

    try {
      // 1. Verify product exists
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
        select: { id: true },
      });

      if (!product) {
        this.logger.warn(
          `Like toggle failed: Product ID ${productId} not found`,
        );
        throw new NotFoundException("Product not found");
      }

      // 2. Query compound key userId_productId
      const existing = await this.prisma.like.findUnique({
        where: {
          userId_productId: { userId, productId },
        },
      });

      // 3. Toggle logic
      if (existing) {
        // delete the row where existing user
        await this.prisma.like.delete({ where: { id: existing.id } });
        this.logger.log(
          `Product unliked for User ID: ${userId} on Product ID: ${productId}`,
        );
        return { isActive: false, message: "Product unliked" };
        // ⛔ STOP RIGHT HERE!
        // Because of 'return', JavaScript EXITS the function immediately.
        // The code below this line WILL NOT RUN.
      }

      await this.prisma.like.create({
        data: { userId, productId },
      });
      this.logger.log(
        `Product liked for User ID: ${userId} on Product ID: ${productId}`,
      );
      return { isActive: true, message: "Product liked" };
    } catch (error) {
      // 👈 2. Rethrow expected HTTP exceptions (404, 400, 401, etc.)
      if (error instanceof HttpException) {
        throw error;
      }

      // 👈 3. Only log unexpected database or server crashes as ERRORs
      this.logger.error(
        `Error toggling like for User ID: ${userId} on Product ID: ${productId}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  // Count total likes for a product
  async getLikesCount(productId: string): Promise<number> {
    this.logger.log(`Fetching likes count for Product ID: ${productId}`);

    try {
      const count = await this.prisma.like.count({
        where: { productId },
      });

      this.logger.log(`Product ID ${productId} has ${count} like(s)`);
      return count;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `Error fetching likes count for Product ID: ${productId}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }
}
