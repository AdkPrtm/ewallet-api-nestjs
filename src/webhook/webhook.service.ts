import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';

@Injectable()
export class WebhookService {
  constructor(private readonly prismaService: PrismaService) {}

  async topupStatus(invoiceId: string, status: string = 'SUCCEDED') {
    const transaction = await this.prismaService.$transaction(
      async (prisma) => {
        const txData = await prisma.transaction.update({
          where: { transactionCode: invoiceId },
          data: { status: status },
        });

        await prisma.wallet.update({
          where: { userId: txData.userId },
          data: { balance: txData.amount },
        });
        return txData;
      },
    );

    return !!transaction;
  }
}
