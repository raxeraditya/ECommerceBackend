// src/likes/likes.controller.ts
import { Controller, Post, Get, Param, Request } from "@nestjs/common";
import { LikesService } from "./likes.service";
import { ToggleLikeParamDto } from "./dto/toggle-like-param.dto";
import type { AuthenticatedRequest } from "../common/types/auth.interface";

@Controller("likes")
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  // POST /likes/products/:productId (Toggle like)
  @Post("products/:productId")
  async toggleLike(
    @Param() paramDto: ToggleLikeParamDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.likesService.toggleLike(req.user.sub, paramDto.productId);
  }

  // GET /likes/products/:productId/count
  @Get("products/:productId/count")
  async getLikesCount(@Param() paramDto: ToggleLikeParamDto) {
    const count = await this.likesService.getLikesCount(paramDto.productId);
    return { productId: paramDto.productId, likesCount: count };
  }
}
