import { HttpException, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SentMessageInfo } from 'nodemailer/lib/smtp-transport';
import { SendMailOTPRegister } from '../utils/constans';
import { generateNumber } from '../utils/helper.utils';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter<SentMessageInfo>;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: 465,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });
    }

    async sendMailOTPRegister(to: string, otp:string) {
        try {
            const res = await this.transporter.sendMail(SendMailOTPRegister(to, otp));
            return res.messageId;
        } catch (error) {
            throw new HttpException("Failed to send OTP", 500)
        }
    }
}
