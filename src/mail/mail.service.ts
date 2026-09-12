import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";





@Injectable()
export class MailService {
    private readonly transporter: nodemailer.Transporter;
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT),
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });
    }


    async sendMail(to: string, subject: string, text: string) {
        await this.transporter.sendMail({
            from: process.env.MAIL_USER,
            to,
            subject,
            text,
        });
    }
}