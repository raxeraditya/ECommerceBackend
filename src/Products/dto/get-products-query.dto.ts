import { IsOptional, IsInt, Min, Max } from "class-validator";
import { Type } from "class-transformer";

export class GetProductsQueryDto {
  @IsOptional()
  @Type(() => Number) // 👈 Converts string "1" to number 1
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number) // 👈 Converts string "5" to number 5
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;

  @IsOptional()
  search?: string;
}
