import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { KeypairModule } from '../keypair/keypair.module';
import { CustomConfigService } from '../custom-config.service';

@Module({
  imports: [KeypairModule],
  providers: [TokenService, CustomConfigService],
  exports: [TokenService],
})
export class TokenModule {}
