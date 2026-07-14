// src/bookmarks/bookmarks.controller.ts
import { Controller, Post, Get, Param, Request } from "@nestjs/common";
import { BookmarksService } from "./bookmarks.service";
import { ToggleBookmarkParamDto } from "./dto/toggle-bookmark-param.dto";
import {
  ToggleBookmarkResponseDto,
  BookmarkedProductResponseDto,
} from "./dto/bookmark-response.dto";
import type { AuthenticatedRequest } from "../common/types/auth.interface";

@Controller("bookmarks")
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  // POST /bookmarks/products/:productId (Toggle bookmark)
  @Post("products/:productId")
  async toggleBookmark(
    @Param() params: ToggleBookmarkParamDto, // 👈 DTO validation applied
    @Request() req: AuthenticatedRequest,
  ): Promise<ToggleBookmarkResponseDto> {
    return this.bookmarksService.toggleBookmark(req.user.sub, params.productId);
  }

  // GET /bookmarks (Get all bookmarked products for current user)
  @Get()
  async getUserBookmarks(
    @Request() req: AuthenticatedRequest,
  ): Promise<BookmarkedProductResponseDto[]> {
    return this.bookmarksService.getUserBookmarks(req.user.sub);
  }
}
