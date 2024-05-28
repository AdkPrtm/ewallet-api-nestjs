import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { GetTransactionResponseBody } from 'src/model/transaction.model';

@Injectable()
export class TransactionService {
  constructor(private readonly prismaService: PrismaService) {}

  async getTransactionService(
    userInfo: string,
  ): Promise<GetTransactionResponseBody[]> {
    const allTx = await this.prismaService.transaction.findMany({
      where: { userId: userInfo },
      include: {
        DataPlanHistories: true,
        paymentMethod: true,
        productData: true,
        transactionType: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    const dataRes: GetTransactionResponseBody[] = allTx.map((txInfo) => {
      return {
        id: txInfo.id,
        amount: txInfo.amount,
        transaction_name: txInfo.transactionType.name,
        transaction_action: txInfo.transactionType.action,
        transaction_thumbnail: txInfo.transactionType.thumbnail,
      };
    });
    return dataRes;
  }
}
