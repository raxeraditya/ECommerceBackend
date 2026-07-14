// src/products/products.controller.ts
import { Controller, Get, Query } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { GetProductsQueryDto } from "./dto/get-products-query.dto";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Query() queryDto: GetProductsQueryDto) {
    // page and limit are ALREADY numbers here! No need for +page or +limit
    return this.productsService.findAll(
      queryDto.page,
      queryDto.limit,
      queryDto.search,
    );
  }
}
