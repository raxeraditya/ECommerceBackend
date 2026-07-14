import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { Logger } from "nestjs-pino"; // 👈 1. Import Logger from nestjs-pino
import { AppModule } from "./app.module";

async function bootstrap() {
  // 👈 2. Add bufferLogs: true to catch initial bootstrap logs
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // 👈 3. Instruct NestJS to use Pino as the application logger
  app.useLogger(app.get(Logger));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const port = parseInt(process.env.PORT ?? "3000", 10) || 3000;

  await app.listen(port, "0.0.0.0");

  // 👈 4. Optional: Log startup with Pino instead of console.log
  const logger = app.get(Logger);
  logger.log(`Server running at http://localhost:${port}`);
}

bootstrap().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
