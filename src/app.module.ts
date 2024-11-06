import { Module } from '@nestjs/common';
import { AppController } from './api/app.controller';
import { AppService } from './service/app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CustomConfigService } from './service/custom-config.service';
import { TokenModule } from './service/token/token.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), TokenModule],
  controllers: [AppController],
  providers: [AppService, ConfigService, CustomConfigService],
})
export class AppModule {}
