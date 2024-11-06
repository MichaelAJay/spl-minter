import { IsInt, IsString } from 'class-validator';

export class MintTokensRequestPayloadDto {
  @IsString()
  mintPubkey: string;

  @IsString()
  ataPubKey: string;

  @IsInt()
  tokensToMint: number;

  @IsInt()
  decimals: number;
}
