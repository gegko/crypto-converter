import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { BybitModule } from './bybit/bybit.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CurrenciesModule } from './currencies/currencies.module';
import { ConvertController } from './convert/convert.controller';
import { ConvertService } from './convert/convert.service';
import { ConvertModule } from './convert/convert.module';
import { AppInitializationService } from './app-initialization/app-initialization.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    PrismaModule,
    BybitModule,
    ScheduleModule.forRoot(),
    CurrenciesModule,
    ConvertModule,
    CacheModule.register({
      isGlobal: true,
    }),
  ],
  controllers: [AppController, ConvertController],
  providers: [AppService, ConvertService, AppInitializationService],
})
export class AppModule {}
