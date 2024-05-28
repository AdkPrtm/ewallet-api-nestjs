import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { Auth } from 'src/common/auth.decorator';
import { User } from '@prisma/client';
import {
  UpdatePinWalletRequestBody,
  VerificationPinWalletRequestBody,
} from 'src/model/wallet.model';

@Controller('api/wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getWallet(@Auth() user: User) {
    return await this.walletService.getWalletService(user.id);
  }

  @Put()
  @HttpCode(HttpStatus.CREATED)
  async updatePinWallet(
    @Auth() user: User,
    @Body() request: UpdatePinWalletRequestBody,
  ) {
    const resultUpdate = await this.walletService.updatePinWalletService(
      request,
      user.id,
    );
    return {
      message: resultUpdate,
    };
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async verificationPin(
    @Auth() user: User,
    @Body() request: VerificationPinWalletRequestBody,
  ) {
    const resultVerif = await this.walletService.verificationPinWalletService(
      request,
      user.id,
    );
    return {
      message: resultVerif,
    };
  }
}
