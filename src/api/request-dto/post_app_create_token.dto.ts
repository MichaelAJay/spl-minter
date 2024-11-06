import { IsInt, IsString } from 'class-validator';

export class CreateTokenRequestPayloadDto {
  @IsString()
  name: string;

  @IsInt()
  decimals: number;
}
