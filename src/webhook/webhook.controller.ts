import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('/xendit/vabank')
  @HttpCode(HttpStatus.OK)
  async bankVAPaid(
    @Body() body: any,
    @Headers('x-callback-token') headers: string,
  ) {
    if (headers != process.env.WEBHOOK_SECRET)
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    const result = await this.webhookService.topupStatus(body.external_id);
    return result;
  }

  @Post('xendit/ewallet')
  @HttpCode(HttpStatus.OK)
  async ewalletPaid(
    @Body() body: any,
    @Headers('x-callback-token') headers: string,
  ) {
    if (headers != process.env.WEBHOOK_SECRET)
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    const result = await this.webhookService.topupStatus(
      body.data.reference_id,
      body.status,
    );
    return result;
  }

  // WHEN SUCCEDED, FVA created WEBHOOK STILL SEND STATUS ACTIVE
  // @Post('/xendit/createpayment')
  // @HttpCode(HttpStatus.OK)
  // async createdPayment(
  //     @Body() body: any,
  //     @Headers('x-callback-token') headers: string
  // ) {
  //     if (headers != process.env.WEBHOOK_SECRET) throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST)
  //     const result = await this.webhookService.topupStatus(body.external_id, body.status)
  //     return result
  // }
}
