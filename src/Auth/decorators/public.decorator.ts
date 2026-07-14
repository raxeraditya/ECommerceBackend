// public.decorator.ts
import { SetMetadata } from "@nestjs/common";

export const IS_PUBLIC_KEY = "isPublic";

/**
 * Decorator to mark routes as public, bypassing the global AuthGuard.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
