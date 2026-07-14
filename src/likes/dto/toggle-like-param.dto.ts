// src/likes/dto/toggle-like-param.dto.ts
import { IsNotEmpty, IsString } from "class-validator";

export class ToggleLikeParamDto {
  @IsString()
  @IsNotEmpty({ message: "Product ID is required" })
  productId!: string;
}
