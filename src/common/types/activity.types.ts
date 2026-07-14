// src/common/types/activity.types.ts
export interface ToggleActivityResponse {
  isActive: boolean; // true if added/liked, false if removed/unliked
  message: string;
}
