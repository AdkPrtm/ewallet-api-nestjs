import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { TipsService } from './tips.service';
import { GetQueryParamRequestQuery } from 'src/model/tips.dto';

@Controller('api/tips')
export class TipsController {
  constructor(private tipsService: TipsService) {}
  @Get()
  async getTips(
    @Query('limit', ParseIntPipe) limit: number,
    @Query('page', ParseIntPipe) page: number,
  ) {
    const data: GetQueryParamRequestQuery = {
      limit: limit,
      page: page,
    };
    const dataResult = await this.tipsService.getTips(data);
    return dataResult;
  }
}
