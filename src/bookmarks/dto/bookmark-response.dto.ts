// src/bookmarks/dto/bookmark-response.dto.ts

export class ToggleBookmarkResponseDto {
  isActive!: boolean;
  message!: string;
}

export class BookmarkedProductResponseDto {
  id!: string;
  name!: string;
  description?: string | null;
  price!: number;
  imageUrl!: string;
  createdAt!: Date;
  updatedAt!: Date;
}
