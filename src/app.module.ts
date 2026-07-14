import {
  Module,
  type MiddlewareConsumer,
  type NestModule,
} from "@nestjs/common";
import { AppController } from "./app.controller";
import { UsersModule } from "./Users/users.module";
import { AuthModule } from "./Auth/auth.module";
import { ProductsModule } from "./Products/products.module";
import { PrismaModule } from "./Prisma/prisma.module";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "./Auth/auth.guard";
import { BookmarksModule } from "./bookmarks/bookmarks.module";
import { LikesModule } from "./likes/likes.module";
import { LoggingMiddleware } from "./common/middleware/logging.middleware";
import { LoggerModule } from "nestjs-pino";

// 📍 Check if running locally (not on Vercel and in dev mode)
const isLocalDev = process.env.NODE_ENV !== "production" && !process.env.VERCEL;

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ProductsModule,
    PrismaModule,
    BookmarksModule,
    LikesModule,
    LoggerModule.forRoot({
      pinoHttp: {
        // 1. Automatic request logging
        autoLogging: true,

        // 2. Custom format for HTTP logs
        customProps: () => ({}),

        // 3. Hide heavy request header clutter from logs
        serializers: {
          req: () => undefined,
        },

        // 4. Use pino-pretty ONLY in local dev environment
        // On Vercel, it defaults to standard synchronous JSON logging
        transport: isLocalDev
          ? {
              target: "pino-pretty",
              options: {
                colorize: true,
                singleLine: true,
                ignore: "pid,hostname,req,res",
                translateTime: "SYS:HH:MM:ss.l",
              },
            }
          : undefined,
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard, // Applies AuthGuard globally
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Applies logging middleware to ALL routes
    consumer.apply(LoggingMiddleware).forRoutes("*");
  }
}
