import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import {
  BuyDataMobileRequestBody,
  GetOperatorResponseBody,
  OperatorCardClass,
} from 'src/model/mobile.model';
import { GetQueryParamRequestQuery } from 'src/model/tips.dto';
import { generateRandomString } from 'src/utils/helper.utils';
import { MobileValidation } from 'src/utils/validation/mobile.validation';
import { TipsValidation } from 'src/utils/validation/tips.validation';

@Injectable()
export class MobileService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly validationService: ValidationService,
  ) {}

  async getOperatorMobile(
    request: GetQueryParamRequestQuery,
  ): Promise<GetOperatorResponseBody> {
    const requestOperatorMobile = this.validationService.validate(
      TipsValidation.QUERY,
      request,
    );

    if (
      requestOperatorMobile.page === 0 ||
      requestOperatorMobile.page === undefined
    )
      requestOperatorMobile.page = 1;
    const skip = (requestOperatorMobile.page - 1) * requestOperatorMobile.limit;

    const operatorMobile = await this.prismaService.operatorCard.findMany({
      skip: skip,
      take: requestOperatorMobile.limit,
      include: {
        DataPlan: true,
      },
    });

    const totalCount = await this.prismaService.tip.count();
    const totalPages = Math.ceil(totalCount / requestOperatorMobile.limit);

    const data: OperatorCardClass[] = operatorMobile.map((operatorMobile) => {
      return {
        id: operatorMobile.id,
        name: operatorMobile.name,
        status: operatorMobile.status,
        thumbnail: operatorMobile.thumbnail,
        data_plans: operatorMobile.DataPlan.map((dataPlan) => {
          return {
            id: dataPlan.id,
            name: dataPlan.name,
            price: dataPlan.price,
            operator_card_id: dataPlan.operatorCardId,
          }
        }),
      };
    })

    return {
      data: data,
      current_page: requestOperatorMobile.page,
      last_page: totalPages,
    };
  }

  async buyPacketDataMobile(request: BuyDataMobileRequestBody, userId: string) {
    const requestBuyDataMobile = await this.validationService.validate(
      MobileValidation.BUYDATAMOBILE,
      request,
    );

    const [wallet, dataPlan, transactionType, paymentMethod] =
      await this.prismaService.$transaction([
        this.prismaService.wallet.findUnique({ where: { userId: userId } }),
        this.prismaService.dataPlan.findUnique({
          where: { id: requestBuyDataMobile.data_plan_id },
        }),
        this.prismaService.transactionType.findUnique({
          where: { code: 'internet' },
        }),
        this.prismaService.paymentMethod.findUnique({
          where: { code: 'BALANCE' },
        }),
      ]);
    if (!wallet || !dataPlan || !transactionType || !paymentMethod)
      throw new HttpException('Invalid request', HttpStatus.BAD_REQUEST);
    if (dataPlan.price > wallet.balance)
      throw new HttpException(
        'Your balance is not enough',
        HttpStatus.BAD_REQUEST,
      );

    const isValidPin = await compare(requestBuyDataMobile.pin, wallet.pin);
    if (!isValidPin)
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    const invoiceId = 'DM-' + generateRandomString(12, true);

    const inputTxData = await this.prismaService.$transaction(
      async (prisma) => {
        const txData = await prisma.transaction.create({
          data: {
            userId: userId,
            transactionTypeId: transactionType.id,
            paymentMethodId: paymentMethod.id,
            amount: dataPlan.price,
            transactionCode: invoiceId,
            status: 'SUCCEDED',
          },
        });
        await prisma.dataPlanHistories.create({
          data: {
            dataPlanId: dataPlan.id,
            transactionId: txData.id,
            phoneNumber: requestBuyDataMobile.number_phone,
          },
        });
        await prisma.wallet.update({
          where: { userId: userId },
          data: { balance: wallet.balance - dataPlan.price },
        });
        return txData;
      },
    );

    return inputTxData;
  }
}
