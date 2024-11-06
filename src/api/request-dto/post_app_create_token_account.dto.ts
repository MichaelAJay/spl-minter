import { IsString } from 'class-validator';

export class CreateTokenAccountRequestPayloadDto {
  @IsString()
  ownerPubkey: string;

  @IsString()
  mintPubkey: string;
}
