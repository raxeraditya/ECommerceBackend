import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { Logger } from "nestjs-pino";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // 1. Attach Pino Logger
  app.useLogger(app.get(Logger));

  // 2. Enable Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // 3. Enable CORS if your Next.js frontend calls this API from another domain
  app.enableCors();

  // 4. Bind to Render's PORT and '0.0.0.0'
  const port = parseInt(process.env.PORT ?? "3000", 10);
  await app.listen(port, "0.0.0.0");

  const logger = app.get(Logger);
  logger.log(`Server running on port ${port}`);
}

bootstrap().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
