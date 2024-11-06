import { Module } from '@nestjs/common';
import { KeypairService } from './keypair.service';
import { CustomConfigService } from '../custom-config.service';

@Module({
  providers: [KeypairService, CustomConfigService],
  exports: [KeypairService]
})
export class KeypairModule {}
