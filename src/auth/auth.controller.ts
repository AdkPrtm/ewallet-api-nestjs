import { Body, Controller, HttpCode, HttpException, HttpStatus, Post } from '@nestjs/common';
import {
  CheckDataExistsRequest,
  LoginRequest,
  RegisterRequest,
  VerificationOTPRequest,
} from '../model/auth.model';
import { AuthService } from './auth.service';
import { Auth } from 'src/common/auth.decorator';
import { User } from '@prisma/client';

@Controller('/api/auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('/isdataexists')
  @HttpCode(HttpStatus.OK)
  async checkDataExists(@Body() request: CheckDataExistsRequest) {
    const result = await this.authService.checkDataExists(request);
    return result;
  }

  @Post('/requestotp')
  @HttpCode(HttpStatus.CREATED)
  async sendOTP(
    @Auth() userInfo: User,
  ) {
    if (userInfo.verified) throw new HttpException('Something is wrong', HttpStatus.BAD_REQUEST)
    await this.authService.sendOTPRegisterService(userInfo.email);
    return {
      message: 'OTP sent successfully',
    };
  }

  @Post('/verificationotp')
  @HttpCode(HttpStatus.OK)
  async verificationOTP(
    @Auth() userInfo: User,
    @Body() request: VerificationOTPRequest
  ) {
    if (userInfo.verified) throw new HttpException('Something is wrong', HttpStatus.BAD_REQUEST)
    await this.authService.verificationOTPRegisterService(request, userInfo.email);
    return {
      message: 'Successfully verified',
    };
  }

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() request: RegisterRequest) {
    const result = await this.authService.register(request);
    return result;
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() request: LoginRequest) {
    const result = await this.authService.login(request);
    return result;
  }
}
