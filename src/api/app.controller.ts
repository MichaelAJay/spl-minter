import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateTokenRequestPayloadDto } from './request-dto/post_app_create_token.dto';
import { TokenService } from 'src/service/token/token.service';
import { CreateTokenAccountRequestPayloadDto } from './request-dto/post_app_create_token_account.dto';
import { MintTokensRequestPayloadDto } from './request-dto/post_app_mint_tokens.dto';

@Controller()
export class AppController {
  constructor(private readonly tokenService: TokenService) {}

  @Post('create-token')
  async createToken(@Body() body: CreateTokenRequestPayloadDto) {
    const { name, decimals } = body;
    return this.tokenService.createToken(name, decimals);
  }

  @Get('token-mint/:mintPubKey')
  async getTokenMint(@Param('mintPubKey') mintPubKey: string) {
    return this.tokenService.getTokenMint(mintPubKey);
  }

  @Post('token-account')
  async createTokenAccount(@Body() body: CreateTokenAccountRequestPayloadDto) {
    const { ownerPubkey, mintPubkey } = body;
    return this.tokenService.createTokenAccount(ownerPubkey, mintPubkey);
  }

  @Get('token-account/:tokenAcctPubKey')
  async getTokenAccount(@Param('tokenAcctPubKey') tokenAccountPubkey: string) {
    return this.tokenService.getTokenAccount(tokenAccountPubkey);
  }

  @Get('token-account-balance/:tokenAcctPubKey')
  async getTokenAccountBalance(
    @Param('tokenAcctPubKey') tokenAccountPubkey: string,
  ) {
    return this.tokenService.getTokenAccountBalance(tokenAccountPubkey);
  }

  @Post('mint-tokens')
  async mintTokens(@Body() body: MintTokensRequestPayloadDto) {
    const { mintPubkey, ataPubKey, tokensToMint, decimals } = body;
    return this.tokenService.mintTokens(
      mintPubkey,
      ataPubKey,
      tokensToMint,
      decimals,
    );
  }
}
