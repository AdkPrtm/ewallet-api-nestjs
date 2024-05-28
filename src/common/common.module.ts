import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { PrismaService } from './prisma.service';
import { ValidationService } from './validation.service';
import { SupabaseService } from './supabase.service';
import { ErrorFilter } from './error.filter';
import { APP_FILTER } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MailService } from './mail.service';
import { AuthMiddleware } from './auth.middleware';
import { UserController } from 'src/user/user.controller';
import { AuthController } from 'src/auth/auth.controller';
import { WalletController } from 'src/wallet/wallet.controller';
import { HttpModule } from '@nestjs/axios';
import { MobileController } from 'src/mobile/mobile.controller';
import { TopupController } from 'src/topup/topup.controller';
import { TransactionController } from 'src/transaction/transaction.controller';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WinstonModule.forRoot({
      format: winston.format.json(),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
      ],
      level: 'debug',
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
    {
      ...HttpModule.register({
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `basic ${process.env.XENDIT_SECRET}`,
        },
      }),
      global: true,
    },
  ],
  providers: [
    PrismaService,
    ValidationService,
    SupabaseService,
    MailService,
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
  ],
  exports: [PrismaService, ValidationService, SupabaseService, MailService],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        '/api/auth/isdataexists',
        '/api/auth/register',
        '/api/auth/login',
      )
      .forRoutes(
        UserController,
        AuthController,
        WalletController,
        MobileController,
        TopupController,
        TransactionController,
      );
  }
}
