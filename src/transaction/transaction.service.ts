import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { GetQueryParamRequestQuery } from 'src/model/tips.dto';
import {
  GetTransactionData,
  GetTransactionResponseBody,
  GetTransferData,
  GetTransferResponseBody,
  TransferRequestBody,
} from 'src/model/transaction.model';
import { generateRandomString } from 'src/utils/helper.utils';
import { TipsValidation } from 'src/utils/validation/tips.validation';
import { TransactionValidation } from 'src/utils/validation/transaction.validation';

@Injectable()
export class TransactionService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly validationService: ValidationService,
  ) { }

  async getTransactionService(
    userInfo: string,
    request: GetQueryParamRequestQuery,
  ): Promise<GetTransactionResponseBody> {
    const requestTransactionHistories = this.validationService.validate(
      TipsValidation.QUERY,
      request,
    );

    if (
      requestTransactionHistories.page === 0 ||
      requestTransactionHistories.page === undefined
    )
      requestTransactionHistories.page = 1;
    const skip =
      (requestTransactionHistories.page - 1) *
      requestTransactionHistories.limit;

    const allTx = await this.prismaService.transaction.findMany({
      skip: skip,
      take: requestTransactionHistories.limit,
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

    const totalCount = await this.prismaService.tip.count();
    const totalPages = Math.ceil(
      totalCount / requestTransactionHistories.limit,
    );

    const dataRes: GetTransactionData[] = allTx.map((txInfo) => {
      return {
        id: txInfo.id,
        amount: txInfo.amount,
        transaction_name: txInfo.transactionType.name,
        transaction_action: txInfo.transactionType.action,
        transaction_thumbnail: txInfo.transactionType.thumbnail,
      };
    });

    return {
      data: dataRes,
      current_page: requestTransactionHistories.page,
      last_page: totalPages,
    };
  }

  async getTransferService(
    userInfo: string,
    request: GetQueryParamRequestQuery,
  ): Promise<GetTransferResponseBody> {
    const requestTransferHistories = this.validationService.validate(
      TipsValidation.QUERY,
      request,
    );

    if (
      requestTransferHistories.page === 0 ||
      requestTransferHistories.page === undefined
    )
      requestTransferHistories.page = 1;
    const skip =
      (requestTransferHistories.page - 1) * requestTransferHistories.limit;

    const allTx = await this.prismaService.transferHistories.findMany({
      where: {
        senderId: userInfo,
      },
      select: {
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            verified: true,
            profilePicture: true,
          },
        },
        receiverId: true,
      },
      distinct: ['receiverId'],
      orderBy: {
        createdAt: 'asc',
      },
      take: requestTransferHistories.limit,
      skip: skip
    });

    const totalCount = await this.prismaService.tip.count();
    const totalPages = Math.ceil(totalCount / requestTransferHistories.limit);

    const dataRes: GetTransferData[] = allTx.map((txInfo) => {
      return {
        first_name: txInfo.receiver.firstName,
        last_name: txInfo.receiver.lastName,
        username: txInfo.receiver.username,
        verified: txInfo.receiver.verified,
        profile_picture: txInfo.receiver.profilePicture,
      };
    });

    return {
      data: dataRes,
      current_page: requestTransferHistories.page,
      last_page: totalPages,
    };
  }

  async transferBalanceService(
    request: TransferRequestBody,
    userId: string,
  ): Promise<boolean> {
    const requestTransfer = this.validationService.validate(
      TransactionValidation.TRANSFER,
      request,
    );

    const [senderUser, receiverUser, transactionType, paymentMethod] =
      await this.prismaService.$transaction([
        this.prismaService.wallet.findUnique({
          where: { userId: userId },
          include: { user: true },
        }),
        this.prismaService.user.findUnique({
          where: { username: requestTransfer.send_to },
          include: { Wallet: true },
        }),
        this.prismaService.transactionType.findMany({
          where: { OR: [{ code: 'transfer' }, { code: 'receive' }] },
        }),
        this.prismaService.paymentMethod.findUnique({
          where: { code: 'BALANCE' },
        }),
      ]);

    const isValidPin = await compare(requestTransfer.pin, senderUser.pin);
    if (!isValidPin)
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    if (!senderUser || !receiverUser)
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    if (!transactionType || !paymentMethod)
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);

    if (senderUser.user.username == receiverUser.username)
      throw new HttpException(
        'You cant transfer to yourself',
        HttpStatus.BAD_REQUEST,
      );
    if (senderUser.balance < requestTransfer.amount)
      throw new HttpException(
        'Your balance not enough',
        HttpStatus.BAD_REQUEST,
      );

    const transactionTypeTransfer = transactionType[0];
    const transactionTypeReceive = transactionType[1];
    const invoiceId = 'TF-' + generateRandomString(12, true);

    const transaction = await this.prismaService.$transaction(
      async (prisma) => {
        const resSender = await prisma.transaction.create({
          data: {
            userId: senderUser.userId,
            amount: requestTransfer.amount,
            transactionTypeId: transactionTypeTransfer.id,
            paymentMethodId: paymentMethod.id,
            transactionCode: invoiceId,
            description:
              'Transfer balance to ' +
              receiverUser.firstName +
              ' ' +
              receiverUser.lastName,
            status: 'SUCCEDED',
          },
        });
        await prisma.wallet.update({
          where: { userId: senderUser.userId },
          data: { balance: senderUser.balance - requestTransfer.amount },
        });

        await prisma.transaction.create({
          data: {
            userId: receiverUser.id,
            amount: requestTransfer.amount,
            transactionTypeId: transactionTypeReceive.id,
            paymentMethodId: paymentMethod.id,
            transactionCode: invoiceId,
            description:
              'Receive balance from ' +
              senderUser.user.firstName +
              ' ' +
              senderUser.user.lastName,
            status: 'SUCCEDED',
          },
        });
        await prisma.wallet.update({
          where: { userId: receiverUser.id },
          data: {
            balance: receiverUser.Wallet.balance + requestTransfer.amount,
          },
        });

        await prisma.transferHistories.create({
          data: {
            transactionId: resSender.id,
            transactionCode: invoiceId,
            senderId: senderUser.userId,
            receiverId: receiverUser.id,
          },
        });
        return resSender;
      },
    );

    return !!transaction;
  }
}
