import { Injectable, OnModuleInit } from '@nestjs/common';
import { CustomConfigService } from '../custom-config.service';
import { Connection, Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

@Injectable()
export class KeypairService implements OnModuleInit {
  private payerKeypair: Keypair;
  // Mint & freeze authority
  private tokenAuthorityKeypair: Keypair;
  private connection: Connection;

  constructor(private readonly configService: CustomConfigService) {
    try {
      const payerSecretKey = this.configService.get('PAYER_SECRET_KEY');
      const tokenAuthoritySecretKey = this.configService.get(
        'TOKEN_AUTHORITY_SECRET_KEY',
      );
      const solanaJsonRpcEndpointUrl = this.configService.get(
        'SOLANA_JSON_RPC_ENDPOINT_URL',
      );

      const [payerKeypair, tokenAuthorityKeypair] = [
        payerSecretKey,
        tokenAuthoritySecretKey,
      ].map((key) => Keypair.fromSecretKey(bs58.decode(key)));

      this.payerKeypair = payerKeypair;
      this.tokenAuthorityKeypair = tokenAuthorityKeypair;
      this.connection = new Connection(solanaJsonRpcEndpointUrl, 'confirmed');
    } catch (err) {
      console.error(
        'Keypair service instance could not be created - exiting.',
        err,
      );
      process.exit(1);
    }
  }

  async onModuleInit() {
    try {
      const version = await this.connection.getVersion();
      console.log('Connected to Solana node. Version:', version);

      // Verify that the acceptance accounts are valid
      [
        { name: 'Payer', keypair: this.payerKeypair },
        { name: 'Token authority', keypair: this.tokenAuthorityKeypair },
      ].forEach(async ({ name, keypair }) => {
        const accountInfo = await this.connection.getAccountInfo(
          keypair.publicKey,
        );
        if (accountInfo === null) {
          throw new Error(`${name} account not found on-chain.`);
        } else {
          console.log(`${name} account found on-chain`);
        }
      });
    } catch (err) {
      console.error(
        'Keypair service initialization error - exiting process.',
        err,
      );
      process.exit(1);
    }
  }

  /**
   * Use only as method input - to avoid leakage, do not use for assignment
   * @returns Keypair
   */
  getPayerKeypair() {
    return this.payerKeypair;
  }

  /**
   * Use only as method input - to avoid leakage, do not use for assignment
   * @returns Keypair
   */
  getTokenAuthorityKeypair() {
    return this.tokenAuthorityKeypair;
  }

  generateKeypairFromPrivateKey(privateKey: string) {
    const keypair = Keypair.fromSecretKey(bs58.decode(privateKey));
    return keypair;
  }
}
