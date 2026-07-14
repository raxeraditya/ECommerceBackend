import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { Logger } from "nestjs-pino";
import { AppModule } from "./app.module";

// Cache the serverless application instance across cold starts
let cachedApp: any;

async function bootstrap() {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule, { bufferLogs: true });

    // Attach NestJS-Pino logger
    app.useLogger(app.get(Logger));

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );

    // Initialize the Nest application without binding to a TCP port
    await app.init();

    // Cache the underlying Express instance
    cachedApp = app.getHttpAdapter().getInstance();
  }

  return cachedApp;
}

// 1. Export for Vercel Serverless Function Handler
export default async function handler(req: any, res: any) {
  const server = await bootstrap();
  return server(req, res);
}

// 2. Local Development Runner (Runs app.listen only when executed directly via Bun/Node)
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  async function runLocal() {
    const app = await NestFactory.create(AppModule, { bufferLogs: true });
    app.useLogger(app.get(Logger));

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );

    const port = parseInt(process.env.PORT ?? "3000", 10) || 3000;
    await app.listen(port, "0.0.0.0");

    const logger = app.get(Logger);
    logger.log(`Server running locally at http://localhost:${port}`);
  }

  runLocal().catch((error) => {
    console.error("Failed to start local server:", error);
    process.exit(1);
  });
}
