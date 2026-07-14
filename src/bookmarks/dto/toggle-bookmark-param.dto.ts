// src/bookmarks/dto/toggle-bookmark-param.dto.ts
import { IsNotEmpty, IsString } from "class-validator";

export class ToggleBookmarkParamDto {
  @IsString()
  @IsNotEmpty({ message: "Product ID is required" })
  productId!: string;
}
