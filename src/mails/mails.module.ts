import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module } from '@nestjs/common';
import { join } from 'path';
import { NodemailerService } from './nodemailer.service';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST'),
          secure: false,
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"No Reply" <${config.get('MAIL_FROM')}>`,
        },
        template: {
          dir: join(__dirname, './templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },

      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: 'IMailService',
      useClass: NodemailerService
    },
    {
      provide: 'FRONTEND_BASE_URL',
      useValue: process.env.FRONTEND_BASE_URL || 'http://localhost:3000'
    }
  ],
  exports: ['IMailService'],
})
export class MailsModule { }
