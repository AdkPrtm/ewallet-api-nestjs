import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { AxiosError } from 'axios';
import { compare } from 'bcrypt';
import { addDays } from 'date-fns';
import { catchError, lastValueFrom } from 'rxjs';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import {
  TopupEwalletResponseBody,
  TopupRequestBody,
  TopupVAResponseBody,
} from 'src/model/topup.model';
import { bankVACode, ewalletCode } from 'src/utils/constans';
import { generateRandomString } from 'src/utils/helper.utils';
import { TopupValidation } from 'src/utils/validation/topup.validation';

@Injectable()
export class TopupService {
  constructor(
    private httpService: HttpService,
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async makeTopup(
    request: TopupRequestBody,
    user: User,
  ): Promise<TopupVAResponseBody | TopupEwalletResponseBody> {
    const requestTopup = this.validationService.validate(
      TopupValidation.MAKETOPUP,
      request,
    );

    const wallet = await this.prismaService.wallet.findUnique({
      where: { userId: user.id },
    });
    if (!wallet) throw new HttpException('User not found', 400);

    const isValidPin = await compare(requestTopup.pin, wallet.pin);
    if (!isValidPin) throw new HttpException('Invalid credentials', 400);

    const [transactionType, paymentMethod] =
      await this.prismaService.$transaction([
        this.prismaService.transactionType.findUnique({
          where: { code: requestTopup.transaction_type },
        }),
        this.prismaService.paymentMethod.findUnique({
          where: { code: requestTopup.payment_code },
        }),
      ]);

    if (!transactionType || !paymentMethod)
      throw new HttpException('Invalid request', 400);

    const invoiceId = 'TP-' + generateRandomString(12, true);
    const expiresAt = addDays(Date.now(), 1);

    if (ewalletCode.includes(requestTopup.payment_code)) {
      const dataBody = JSON.stringify({
        reference_id: invoiceId,
        currency: 'IDR',
        amount: requestTopup.amount,
        checkout_method: 'ONE_TIME_PAYMENT',
        channel_code: requestTopup.payment_code,
        channel_properties: {
          success_redirect_url: 'https://redirect.me/?https://www.google.com/',
        },
        metadata: {
          branch_area: 'BALIKPAPAN SELATAN',
          branch_city: 'BALIKPAPAN',
        },
      });

      const transaction = await this.prismaService.$transaction(
        async (prisma) => {
          await prisma.transaction.create({
            data: {
              userId: user.id,
              transactionTypeId: transactionType.id,
              paymentMethodId: paymentMethod.id,
              amount: requestTopup.amount,
              transactionCode: invoiceId,
              status: 'PENDING',
            },
          });
          const { data } = await lastValueFrom(
            this.httpService
              .post('https://api.xendit.co/ewallets/charges', dataBody)
              .pipe(
                catchError((error: AxiosError) => {
                  throw new HttpException(error.message, 500);
                }),
              ),
          );
          return data;
        },
      );

      return {
        reference_id: invoiceId,
        charge_amount: requestTopup.amount,
        link_payment:
          requestTopup.payment_code === 'ID_SHOPEEPAY'
            ? transaction.actions.mobile_deeplink_checkout_url
            : transaction.actions.mobile_web_checkout_url,
      };
    } else if (bankVACode.includes(requestTopup.payment_code)) {
      const dataBody = JSON.stringify({
        external_id: invoiceId,
        bank_code: requestTopup.payment_code,
        name: `${user.firstName} ${' '} ${user.lastName}`,
        is_closed: 'true',
        is_single_use: 'true',
        currency: 'IDR',
        expected_amount: requestTopup.amount,
        expiration_date: expiresAt,
      });

      const transaction = await this.prismaService.$transaction(
        async (prisma) => {
          await prisma.transaction.create({
            data: {
              userId: user.id,
              transactionTypeId: transactionType.id,
              paymentMethodId: paymentMethod.id,
              amount: requestTopup.amount,
              transactionCode: invoiceId,
              status: 'PENDING',
            },
          });

          const { data } = await lastValueFrom(
            this.httpService
              .post('https://api.xendit.co/callback_virtual_accounts', dataBody)
              .pipe(
                catchError((error: AxiosError) => {
                  throw new HttpException(error.message, 500);
                }),
              ),
          );
          return data;
        },
      );
      return {
        external_id: invoiceId,
        payment_name: paymentMethod.name,
        account_number: transaction.account_number,
        amount: requestTopup.amount,
        expiration_date: expiresAt,
      };
    }
  }

  async getPaymentMethod() {
    const paymentMethodData = await this.prismaService.paymentMethod.findMany(
      {},
    );

    if (!paymentMethodData)
      throw new HttpException('Something went wrong', 500);

    return paymentMethodData;
  }
}
