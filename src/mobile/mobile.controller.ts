import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { MobileService } from './mobile.service';
import { GetQueryParamRequestQuery } from 'src/model/tips.dto';
import { BuyDataMobileRequestBody } from 'src/model/mobile.model';
import { Auth } from 'src/common/auth.decorator';
import { User } from '@prisma/client';

@Controller('api/mobile')
export class MobileController {
  constructor(private mobileService: MobileService) {}

  @Get()
  async getOperatorMobile(
    @Query('limit', ParseIntPipe) limit: number,
    @Query('page', ParseIntPipe) page: number,
  ) {
    const data: GetQueryParamRequestQuery = {
      limit: limit,
      page: page,
    };
    return this.mobileService.getOperatorMobile(data);
  }

  @Post()
  async buyPacketDataMobile(
    @Body() request: BuyDataMobileRequestBody,
    @Auth() user: User,
  ) {
    const result = await this.mobileService.buyPacketDataMobile(
      request,
      user.id,
    );
    return result;
  }
}
