import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { Logger } from "nestjs-pino";
import { AppModule } from "./app.module";

let cachedServer: any;

/**
 * Bootstraps the NestJS application instance for Serverless execution (Vercel)
 */
async function bootstrapServerless() {
  if (!cachedServer) {
    const app = await NestFactory.create(AppModule, { bufferLogs: true });

    app.useLogger(app.get(Logger));

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );

    app.enableCors();

    // Initialize NestJS dependency graph without binding a TCP port
    await app.init();

    // Cache the underlying Express application instance
    cachedServer = app.getHttpAdapter().getInstance();
  }
  return cachedServer;
}

/**
 * Serverless Handler Export for Vercel
 */
export default async function handler(req: any, res: any) {
  const server = await bootstrapServerless();
  return server(req, res);
}

/**
 * Standalone Process Runner for Render / Local Development
 * (Executes app.listen when NOT running inside Vercel serverless environment)
 */
if (!process.env.VERCEL) {
  async function bootstrapStandalone() {
    const app = await NestFactory.create(AppModule, { bufferLogs: true });

    app.useLogger(app.get(Logger));

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );

    app.enableCors();

    const port = parseInt(process.env.PORT ?? "3000", 10);
    await app.listen(port, "0.0.0.0");

    const logger = app.get(Logger);
    logger.log(`Server running on port ${port}`);
  }

  bootstrapStandalone().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
}
