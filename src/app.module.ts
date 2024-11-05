import { Module } from '@nestjs/common';
import { AppController } from './api/app.controller';
import { AppService } from './service/app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CustomConfigService } from './service/custom-config.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
  providers: [AppService, ConfigService, CustomConfigService],
})
export class AppModule {}
