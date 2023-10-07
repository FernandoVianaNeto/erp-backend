import { Module } from '@nestjs/common';
import { AxiosCustomService } from './application/services/axios-custom.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [AxiosCustomService],
  exports: [AxiosCustomService],
})
export class AxiosCustomModule {}
