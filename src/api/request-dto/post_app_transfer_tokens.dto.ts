import { IsInt, IsString } from 'class-validator';

export class TransferTokensRequestPayload {
  @IsString()
  mintPubkey: string;

  @IsString()
  senderAtaPubkey: string;

  @IsString()
  receiverAtaPubkey: string;

  @IsInt()
  tokensToMint: number;

  @IsInt()
  decimals: number;
}
