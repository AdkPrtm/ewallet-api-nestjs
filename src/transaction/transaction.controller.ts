import { Controller, Get } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Auth } from 'src/common/auth.decorator';
import { User } from '@prisma/client';

@Controller('api/transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  async getTransaction(@Auth() user: User) {
    const res = await this.transactionService.getTransactionService(user.id);
    return res;
  }

  // @Post()
  // async transferBalance(@Auth() user: User, @Body() body: TransferRequestBody) {
  //   // const res = await this.transactionService.
  // }
}
