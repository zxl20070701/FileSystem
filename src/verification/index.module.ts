import { Module } from '@nestjs/common'
import { VerificationController } from './index.controller'

@Module({
  controllers: [VerificationController]
})
export class VerificationModule { }
