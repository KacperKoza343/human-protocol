import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HCaptchaService } from './hcaptcha.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [HCaptchaService],
  exports: [HCaptchaService],
})
export class HCaptchaModule {}
