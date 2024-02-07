import { Module } from '@nestjs/common'
import { HandlerController } from './index.controller'
import { DistService } from './dist.service'

@Module({
  controllers: [HandlerController],
  providers: [DistService]
})
export class HandlerModule { }
