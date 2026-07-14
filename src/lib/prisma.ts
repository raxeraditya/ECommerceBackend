import { PrismaClient } from "../generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

// Clean surrounding quotes or whitespace from environment variable
const rawDatabaseUrl = process.env.DATABASE_URL;
const databaseUrl =
  rawDatabaseUrl?.replace(/^["']|["']$/g, "").trim() || "file:./dev.db";

// Pass the config object directly to PrismaLibSql
const adapter = new PrismaLibSql({
  url: databaseUrl,
  authToken: process.env.TURSO_AUTH_TOKEN, // Optional if using Turso Cloud
});

export const prismaClientOptions = { adapter };

export function createPrismaClient() {
  return new PrismaClient(prismaClientOptions);
}
