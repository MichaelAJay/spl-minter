import { Controller, Post } from '@nestjs/common';
import { AppService } from 'src/service/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('tx')
  async postTransaction() {
    return this.appService.postTransaction();
  }
}
