import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CheckDataExistsRequest, LoginRequest, OTPRequest, RegisterRequest, VerificationOTPRequest } from '../model/auth.model';
import { AuthService } from './auth.service';

@Controller('/api/auth')
export class AuthController {
    constructor(private authService: AuthService) { }


    @Post('/isdataexists')
    @HttpCode(HttpStatus.OK)
    async checkDataExists(
        @Body() request: CheckDataExistsRequest
    ) {
        const result = await this.authService.checkDataExists(request);
        return result;
    }

    @Post('/requestotp')
    @HttpCode(HttpStatus.CREATED)
    async sendOTP(
        @Body() request: OTPRequest
    ) {
        await this.authService.sendOTPRegisterService(request);
        return {
            message: 'OTP sent successfully'
        };
    }

    @Post('/verificationotp')
    @HttpCode(HttpStatus.OK)
    async verificationOTP(
        @Body() request: VerificationOTPRequest
    ) {
        await this.authService.verificationOTPRegisterService(request);
        return {
            message: 'Successfully verified'
        };
    }

    @Post('/register')
    @HttpCode(HttpStatus.CREATED)
    async register(
        @Body() request: RegisterRequest
    ) {
        const result = await this.authService.register(request);
        return result;
    }

    @Post('/login')
    @HttpCode(HttpStatus.OK)
    async login(
        @Body() request: LoginRequest
    ) {
        const result = await this.authService.login(request);
        return result;
    }
}
