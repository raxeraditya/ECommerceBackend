// src/bookmarks/bookmarks.service.ts
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../Prisma/prisma.service";
import type { ToggleActivityResponse } from "../common/types/activity.types";

@Injectable()
export class BookmarksService {
  // 📍 Context-bound logger for BookmarksService
  private readonly logger = new Logger(BookmarksService.name);

  constructor(private readonly prisma: PrismaService) {}

  async toggleBookmark(
    userId: string,
    productId: string,
  ): Promise<ToggleActivityResponse> {
    this.logger.log(
      `Toggling bookmark for User ID: ${userId} on Product ID: ${productId}`,
    );

    try {
      // 1. Verify product exists
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
        select: { id: true },
      });

      if (!product) {
        this.logger.warn(
          `Bookmark toggle failed: Product ID ${productId} not found`,
        );
        throw new NotFoundException("Product not found");
      }

      // 2. Query compound key userId_productId
      const existing = await this.prisma.bookmark.findUnique({
        where: {
          userId_productId: { userId, productId },
        },
      });

      // 3. Toggle logic
      if (existing) {
        await this.prisma.bookmark.delete({ where: { id: existing.id } });
        this.logger.log(
          `Bookmark removed for User ID: ${userId} on Product ID: ${productId}`,
        );
        return { isActive: false, message: "Bookmark removed" };
      }

      await this.prisma.bookmark.create({
        data: { userId, productId },
      });
      this.logger.log(
        `Bookmark created for User ID: ${userId} on Product ID: ${productId}`,
      );
      return { isActive: true, message: "Bookmarked successfully" };
    } catch (error) {
      this.logger.error(
        `Error toggling bookmark for User ID: ${userId} on Product ID: ${productId}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  // Fetch saved products for the authenticated user
  async getUserBookmarks(userId: string) {
    this.logger.log(`Fetching bookmarks for User ID: ${userId}`);

    try {
      const bookmarks = await this.prisma.bookmark.findMany({
        where: { userId },
        include: { product: true },
        orderBy: { createdAt: "desc" },
      });

      this.logger.log(
        `Retrieved ${bookmarks.length} bookmarked product(s) for User ID: ${userId}`,
      );

      return bookmarks.map((b) => b.product);
    } catch (error) {
      this.logger.error(
        `Error fetching bookmarks for User ID: ${userId}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }
}
