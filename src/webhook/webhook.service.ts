import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { NotificationService } from 'src/notification-service/notification-service.service';

@Injectable()
export class WebhookService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

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

        const wallet = await prisma.wallet.findUnique({
          where: { userId: txData.userId },
        });

        const user = await prisma.user.findUnique({
          where: { id: txData.userId },
        });
        await this.notificationService.sendNotification(
          'Topup Success',
          `Your topup of Rp ${txData.amount.toLocaleString()} has been ${status.toLowerCase()}`,
          user.tokenDevice,
        );

        await prisma.wallet.update({
          where: { userId: txData.userId },
          data: { balance: txData.amount + wallet.balance },
        });
        return txData;
      },
    );

    return !!transaction;
  }
}
