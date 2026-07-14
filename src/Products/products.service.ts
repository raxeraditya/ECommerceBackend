import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../Prisma/prisma.service";

@Injectable()
export class ProductsService {
  // 📍 Context-bound logger for ProductsService
  private readonly logger = new Logger(ProductsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    // 📍 Convert strings to numbers defensively
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;

    this.logger.log(
      `Fetching products - Page: ${pageNum}, Limit: ${limitNum}${
        search ? `, Search Query: "${search}"` : ""
      }`,
    );

    try {
      const skip = (pageNum - 1) * limitNum;

      // Clean search string (trim spaces and strip surrounding quotes if passed accidentally)
      const cleanSearch = search
        ? search.trim().replace(/^"|"$/g, "")
        : undefined;

      if (cleanSearch) {
        this.logger.debug(
          `Applied search filter: name CONTAINS "${cleanSearch}"`,
        );
      }

      // Build Prisma filter
      const where = cleanSearch
        ? {
            name: {
              contains: cleanSearch,
            },
          }
        : {};

      this.logger.debug(
        `Executing Prisma query -> skip: ${skip}, take: ${limitNum}, where: ${JSON.stringify(
          where,
        )}`,
      );

      // Fetch filtered data and count
      const [data, totalItems] = await Promise.all([
        this.prisma.product.findMany({
          where,
          skip,
          take: limitNum,
          orderBy: { createdAt: "desc" },
        }),
        this.prisma.product.count({ where }),
      ]);

      const totalPages = Math.ceil(totalItems / limitNum);

      if (totalItems === 0) {
        this.logger.warn(
          `No products found matching criteria (Search: "${cleanSearch || "N/A"}")`,
        );
      } else {
        this.logger.log(
          `Retrieved ${data.length} product(s) on current page (Total Items: ${totalItems}, Total Pages: ${totalPages})`,
        );
      }

      return {
        data,
        meta: {
          totalItems,
          currentPage: pageNum,
          totalPages,
          limit: limitNum,
          search: cleanSearch || null,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
        },
      };
    } catch (error) {
      this.logger.error(
        `Failed to fetch products (Page: ${pageNum}, Limit: ${limitNum}, Search: "${search}")`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }
}
