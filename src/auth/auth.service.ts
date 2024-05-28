// import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
// import { Logger } from 'winston';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
  RegisterRequest,
  AuthResponse,
  LoginRequest,
  CheckDataExistsRequest,
  CheckDataExistsResponse,
  VerificationOTPRequest,
} from '../model/auth.model';
import { AuthValidation } from '../utils/validation/auth.validation';
import { SupabaseService } from '../common/supabase.service';
import * as bcrypt from 'bcrypt';
import { generateRandomString } from '../utils/helper.utils';
import { JwtService } from '@nestjs/jwt';
import { addMinutes, isAfter } from 'date-fns';
import { MailService } from '../common/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private validationService: ValidationService,
    // @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private supabaseService: SupabaseService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async checkDataExists(
    request: CheckDataExistsRequest,
  ): Promise<CheckDataExistsResponse> {
    const checkDataExistsRequest = this.validationService.validate(
      AuthValidation.CHECKDATAEXISTS,
      request,
    );

    const checkAvaiUsernamelUser = await this.prismaService.user.findUnique({
      where: { username: checkDataExistsRequest.username },
    });

    const checkAvaiEmaillUser = await this.prismaService.user.findUnique({
      where: { email: checkDataExistsRequest.email },
    });

    return {
      is_email_exists: !!checkAvaiUsernamelUser,
      is_username_exists: !!checkAvaiEmaillUser,
    };
  }

  async register(request: RegisterRequest): Promise<AuthResponse> {
    const registerRequest = this.validationService.validate(
      AuthValidation.REGISTER,
      request,
    );

    const checkAvailUser = await this.prismaService.user.findFirst({
      where: {
        OR: [
          { username: registerRequest.username },
          { email: registerRequest.email },
        ],
      },
    });

    if (checkAvailUser)
      throw new HttpException('Account already exists', HttpStatus.BAD_REQUEST);
    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);
    registerRequest.pin = await bcrypt.hash(registerRequest.pin, 10);

    let uploadProfileImage: string;
    if (registerRequest.profile_picture) {
      uploadProfileImage = await this.supabaseService.uploadImageService(
        registerRequest.profile_picture,
        'NewImage',
      );
    }
    registerRequest.profile_picture = `${process.env.STORAGE_URL}/storage/v1/object/public/ewalletapp/${uploadProfileImage ?? 'default.png'}`;

    const randomNumber = generateRandomString(12);
    const cardNumber = '6409' + randomNumber;

    const transction = await this.prismaService.$transaction(async (prisma) => {
      const userData = await prisma.user.create({
        data: {
          firstName: registerRequest.first_name,
          lastName: registerRequest.last_name,
          username: registerRequest.username,
          email: registerRequest.email,
          password: registerRequest.password,
          verified: true,
          profilePicture: registerRequest.profile_picture,
        },
      });

      const wallet = await prisma.wallet.create({
        data: {
          userId: userData.id,
          balance: 0,
          cardNumber: cardNumber,
          pin: registerRequest.pin,
        },
      });

      const payload = {
        id: userData.id,
        username: userData.username,
      };

      const token = this.jwtService.sign(payload);
      return {
        id: userData.id,
        first_name: userData.firstName,
        last_name: userData.lastName,
        username: userData.username,
        email: userData.email,
        profile_picture: userData.profilePicture,
        verified: userData.verified,
        created_at: userData.createdAt,
        updated_at: userData.updatedAt,
        balance: wallet.balance,
        card_number: wallet.cardNumber,
        token: token,
      };
    });
    return transction;
  }

  async login(request: LoginRequest): Promise<AuthResponse> {
    const loginRequest = this.validationService.validate(
      AuthValidation.LOGIN,
      request,
    );

    const checkAvailUser = await this.prismaService.user.findUnique({
      where: { email: loginRequest.email },
    });

    if (!checkAvailUser)
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    const validPassword = await bcrypt.compare(
      loginRequest.password,
      checkAvailUser.password,
    );
    if (!validPassword)
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);

    const transction = await this.prismaService.$transaction(async (prisma) => {
      const userData = await prisma.user.findUnique({
        where: { email: loginRequest.email },
      });

      const wallet = await prisma.wallet.findUnique({
        where: { userId: userData.id },
      });

      const payload = {
        id: userData.id,
        username: userData.username,
      };

      const token = this.jwtService.sign(payload);
      return {
        id: userData.id,
        first_name: userData.firstName,
        last_name: userData.lastName,
        username: userData.username,
        email: userData.email,
        profile_picture: userData.profilePicture,
        verified: userData.verified,
        created_at: userData.createdAt,
        updated_at: userData.updatedAt,
        balance: wallet.balance,
        card_number: wallet.cardNumber,
        token: token,
      };
    });
    return transction;
  }

  async sendOTPRegisterService(userInfo: string): Promise<void> {
    const haveRequestBefore = await this.prismaService.otp.findUnique({
      where: { email: userInfo },
    });
    const otp = generateRandomString(6);

    if (!haveRequestBefore) {
      const createRequestOtp = await this.prismaService.otp.create({
        data: {
          email: userInfo,
          OTP: otp,
          expiresAt: addMinutes(Date.now(), 5),
        },
      });
      if (!createRequestOtp)
        throw new HttpException('Something went wrong', 500);
      this.mailService.sendMailOTPRegister(userInfo, otp);
    } else {
      if (!isAfter(Date.now(), addMinutes(haveRequestBefore.createdAt, 1)))
        throw new HttpException('Waiting for cooling down', 400);
      const updateRequestOtp = await this.prismaService.otp.update({
        where: { email: userInfo },
        data: {
          OTP: otp,
          expiresAt: addMinutes(Date.now(), 5),
        },
      });
      if (!updateRequestOtp)
        throw new HttpException('Something went wrong', 500);
      this.mailService.sendMailOTPRegister(userInfo, otp);
    }
  }

  async verificationOTPRegisterService(
    request: VerificationOTPRequest,
  ): Promise<void> {
    const dataMailRequest = await this.prismaService.otp.findUnique({
      where: { email: request.email },
    });

    if (!dataMailRequest) throw new HttpException('Data not found', 400);

    if (isAfter(Date.now(), dataMailRequest.expiresAt))
      throw new HttpException('OTP Expire, please resend new otp', 400);

    if (dataMailRequest.OTP !== request.otp)
      throw new HttpException('OTP not match', 400);

    const updateUser = await this.prismaService.user.update({
      where: { email: request.email },
      data: { verified: true },
    });

    if (!updateUser) throw new HttpException('Something went wrong', 500);
  }
}
