import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * ConfigService wrapper for env var retrieval that throws if env var is missing
 */

@Injectable()
export class CustomConfigService {
  constructor(private readonly configService: ConfigService) {}

  get(envVarName: string): string {
    const envVar = this.configService.get<string | undefined>(envVarName);
    if (envVar === undefined) {
      throw new Error(`Missing environment variable ${envVarName}`);
    }
    return envVar;
  }
}
