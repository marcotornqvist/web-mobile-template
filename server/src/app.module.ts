import { Module, CacheModule } from '@nestjs/common';
import { AppController } from 'app.controller';
import { AppService } from 'app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'prisma/prisma.module';
import { TodosModule } from 'todos/todos.module';
import { AuthModule } from 'auth/auth.module';
import { UsersModule } from 'users/users.module';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      ttl: 60,
    }),
    PrismaModule,
    TodosModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // to set automatic caching for all get requests.
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CacheInterceptor,
    // },
  ],
})
export class AppModule {}
