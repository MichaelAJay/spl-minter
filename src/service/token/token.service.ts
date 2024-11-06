import { Injectable } from '@nestjs/common';
import { KeypairService } from '../keypair/keypair.service';
import { CustomConfigService } from '../custom-config.service';
import { Connection, PublicKey } from '@solana/web3.js';
import {
  createAssociatedTokenAccount,
  createMint,
  getAccount,
  getMint,
  mintToChecked,
  transferChecked,
} from '@solana/spl-token';
import { writeFileSync } from 'fs';

@Injectable()
export class TokenService {
  private connection: Connection;

  constructor(
    private readonly keypairService: KeypairService,
    private readonly configService: CustomConfigService,
  ) {
    try {
      const solanaJsonRpcEndpointUrl = this.configService.get(
        'SOLANA_JSON_RPC_ENDPOINT_URL',
      );
      this.connection = new Connection(solanaJsonRpcEndpointUrl, 'confirmed');
    } catch (err) {
      console.error(
        'Token service instance could not be created - exiting.',
        err,
      );
      process.exit(1);
    }
  }

  async createToken(name: string, decimals: number) {
    try {
      const mintPubkey = (
        await createMint(
          this.connection,
          this.keypairService.getPayerKeypair(),
          this.keypairService.getTokenAuthorityKeypair().publicKey, // mint authority
          this.keypairService.getTokenAuthorityKeypair().publicKey, // freeze authority
          decimals,
        )
      ).toBase58();

      const data = `mintPubkey ${mintPubkey}`;
      writeFileSync(`${name}-mintPubkey.txt`, data, 'utf8');
      return mintPubkey;
    } catch (err) {
      throw err;
    }
  }

  // TODO: Handle bad mintPubKey in method
  async getTokenMint(mintPubkey: string | PublicKey) {
    if (typeof mintPubkey === 'string') {
      mintPubkey = new PublicKey(mintPubkey);
    }

    const mintAccount = await getMint(this.connection, mintPubkey);
    return mintAccount;
  }

  async createTokenAccount(
    ownerPublicKey: string | PublicKey,
    mintPubkey: string | PublicKey,
  ) {
    if (typeof ownerPublicKey === 'string') {
      ownerPublicKey = new PublicKey(ownerPublicKey);
    }

    const ata = (
      await createAssociatedTokenAccount(
        this.connection,
        this.keypairService.getPayerKeypair(), // Fee payer
        (await this.getTokenMint(mintPubkey)).address, // mint
        ownerPublicKey,
      )
    ).toBase58();

    const data = `ata pub key ${ata}`;
    writeFileSync('ataPubkey.txt', data, 'utf8');
    return ata;
  }

  async getTokenAccount(tokenAcctPubKey: string | PublicKey) {
    if (typeof tokenAcctPubKey === 'string') {
      tokenAcctPubKey = new PublicKey(tokenAcctPubKey);
    }

    const tokenAccount = await getAccount(this.connection, tokenAcctPubKey);
    return tokenAccount;
  }

  async getTokenAccountBalance(tokenAcctPubKey: string | PublicKey) {
    if (typeof tokenAcctPubKey === 'string') {
      tokenAcctPubKey = new PublicKey(tokenAcctPubKey);
    }
    const balance =
      await this.connection.getTokenAccountBalance(tokenAcctPubKey);
    return balance;
  }

  /**
   * Increase the supply and transfer new tokens to specific token account
   * @param mintPubkey
   * @param ataPubkey Public key of ATA to transfer new tokens to
   * @param tokensToMint
   * @param decimals
   * @returns
   */
  async mintTokens(
    mintPubkey: string | PublicKey,
    ataPubkey: string | PublicKey,
    tokensToMint: number,
    decimals: number,
  ) {
    if (typeof mintPubkey === 'string') {
      mintPubkey = new PublicKey(mintPubkey);
    }

    if (typeof ataPubkey === 'string') {
      ataPubkey = new PublicKey(ataPubkey);
    }

    // Ensure token account exists
    await this.getTokenAccount(ataPubkey);

    const txhash = await mintToChecked(
      this.connection,
      this.keypairService.getPayerKeypair(), // fee payer
      mintPubkey, // mint
      ataPubkey, // receiver
      this.keypairService.getTokenAuthorityKeypair(), // mint authority
      tokensToMint * 10 ** decimals, // amount. if your decimals is 8, you mint 10^8 for 1 token
      decimals, //decimals
    );

    const data = `tx hash ${txhash}`;
    writeFileSync('mint_tx_hash.txt', data, 'utf8');
    return txhash;
  }

  async transferTokens(
    mintPubkey: string | PublicKey,
    senderAtaPubkey: string | PublicKey,
    receiverAtaPubkey: string | PublicKey,
    tokensToMint: number,
    decimals: number,
  ) {
    if (typeof mintPubkey === 'string') {
      mintPubkey = new PublicKey(mintPubkey);
    }

    if (typeof senderAtaPubkey === 'string') {
      senderAtaPubkey = new PublicKey(senderAtaPubkey);
    }

    if (typeof receiverAtaPubkey === 'string') {
      receiverAtaPubkey = new PublicKey(receiverAtaPubkey);
    }

    // Ensure token account exists
    await this.getTokenAccount(senderAtaPubkey);
    await this.getTokenAccount(receiverAtaPubkey);

    const txhash = await transferChecked(
      this.connection,
      this.keypairService.getPayerKeypair(), // fee payer
      senderAtaPubkey,
      mintPubkey, // mint
      receiverAtaPubkey, // receiver
      this.keypairService.getTokenAuthorityKeypair(),
      tokensToMint * 10 ** decimals, // amount. if your decimals is 8, you mint 10^8 for 1 token
      decimals, //decimals
    );

    const data = `tx hash ${txhash}`;
    writeFileSync('transfer_tx_hash.txt', data, 'utf8');
    return txhash;
  }
}
