import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Auth } from 'src/common/auth.decorator';
import { User } from '@prisma/client';
import { GetQueryParamRequestQuery } from 'src/model/tips.dto';
import { TransferRequestBody } from 'src/model/transaction.model';

@Controller('api/transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  async getTransactionHistories(
    @Auth() user: User,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('page', ParseIntPipe) page: number,
  ) {
    const request: GetQueryParamRequestQuery = { limit, page };
    console.log(request);
    const res = await this.transactionService.getTransactionService(
      user.id,
      request,
    );
    return res;
  }

  @Get('/transfer')
  async getTransferHistories(
    @Auth() user: User,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('page', ParseIntPipe) page: number,
  ) {
    const request: GetQueryParamRequestQuery = { limit, page };
    console.log(request);
    const res = await this.transactionService.getTransferService(
      user.id,
      request,
    );
    return res;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async transferBalance(@Auth() user: User, @Body() body: TransferRequestBody) {
    const res = await this.transactionService.transferBalanceService(
      body,
      user.id,
    );
    return res;
  }
}
