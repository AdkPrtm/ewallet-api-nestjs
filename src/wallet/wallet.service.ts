import { HttpException, Injectable } from '@nestjs/common';
import { Wallet } from '@prisma/client';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import {
  GetWalletResponseBody,
  UpdatePinWalletRequestBody,
  VerificationPinWalletRequestBody,
} from 'src/model/wallet.model';
import { WalletValidation } from 'src/utils/validation/wallet.validation';
import * as bcrypt from 'bcrypt';

@Injectable()
export class WalletService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly validatorService: ValidationService,
  ) {}

  private async checkDataWallet(userId: string): Promise<Wallet> {
    const wallet = await this.prismaService.wallet.findUnique({
      where: { userId: userId.toString() },
    });
    if (!wallet) throw new HttpException('Data not found', 400);
    return wallet;
  }

  async verificationPinWalletService(
    request: VerificationPinWalletRequestBody,
    userId: string,
  ): Promise<boolean> {
    const requestVerifPinWallet = this.validatorService.validate(
      WalletValidation.VERIFPINWALLET,
      request,
    );

    const wallet = await this.checkDataWallet(userId);

    const isValidPin = await bcrypt.compare(
      requestVerifPinWallet.pin,
      wallet.pin,
    );
    if (!isValidPin) throw new HttpException('Invalid pin', 400);

    return true;
  }

  async getWalletService(userId: string): Promise<GetWalletResponseBody> {
    const wallet = await this.checkDataWallet(userId);

    return {
      balance: wallet.balance,
      card_number: wallet.cardNumber,
    };
  }

  async updatePinWalletService(
    request: UpdatePinWalletRequestBody,
    userId: string,
  ): Promise<boolean> {
    const requestUpdateWallet = this.validatorService.validate(
      WalletValidation.UPDATEWALLET,
      request,
    );

    await this.verificationPinWalletService(
      { pin: requestUpdateWallet.previous_pin },
      userId,
    );

    requestUpdateWallet.new_pin = await bcrypt.hash(
      requestUpdateWallet.new_pin,
      10,
    );
    const resUpdate = await this.prismaService.wallet.update({
      where: { userId: userId.toString() },
      data: { pin: requestUpdateWallet.new_pin },
    });
    if (!resUpdate) throw new HttpException('Something went wrong', 500);

    return true;
  }
}
