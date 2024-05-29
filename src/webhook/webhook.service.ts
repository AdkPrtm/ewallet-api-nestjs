import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';

@Injectable()
export class WebhookService {
  constructor(private readonly prismaService: PrismaService) {}

  async topupStatus(invoiceId: string, status: string = 'SUCCEDED') {
    const trxId = await this.prismaService.transaction.findFirst({
      where: { transactionCode: invoiceId },
    });
    if (!trxId)
      throw new HttpException('Trx not found', HttpStatus.BAD_REQUEST);

    const transaction = await this.prismaService.$transaction(
      async (prisma) => {
        const txData = await prisma.transaction.update({
          where: { id: trxId.id },
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
