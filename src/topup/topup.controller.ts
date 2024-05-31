import { Body, Controller, Get, Post } from '@nestjs/common';
import { TopupService } from './topup.service';
import { TopupRequestBody } from 'src/model/topup.model';
import { Auth } from 'src/common/auth.decorator';
import { User } from '@prisma/client';

@Controller('api/topup')
export class TopupController {
  constructor(private topupService: TopupService) {}

  @Post()
  async topup(@Body() request: TopupRequestBody, @Auth() user: User) {
    const req = await this.topupService.makeTopup(request, user);
    return req;
  }

  @Get()
  async paymentMethodController() {
    const req = await this.topupService.getPaymentMethod();
    return req;
  }
}
