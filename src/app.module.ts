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
        // 1. Prevents attaching the full req/res objects to custom logger messages (e.g., AuthService)
        autoLogging: true, // keeps the automatic "request completed" line, but clean

        // 2. Custom format for HTTP request/response logs
        customProps: () => ({}), // Removes automatic req binding from service logs

        // 3. Serializers control what gets printed for HTTP req/res
        serializers: {
          req: () => undefined, // Hides full req headers/params clutter from logs
        },

        // 4. Pretty print config for development
        transport:
          process.env.NODE_ENV !== "production"
            ? {
                target: "pino-pretty",
                options: {
                  colorize: true,
                  singleLine: true,
                  // Hide unwanted automatic Pino fields
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
    // Applies logging to ALL routes
    consumer.apply(LoggingMiddleware).forRoutes("*");
  }
}
