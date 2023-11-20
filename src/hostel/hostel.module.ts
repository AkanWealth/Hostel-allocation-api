import { Module } from '@nestjs/common';
import { HostelService } from './hostel.service';
import { HostelController } from './hostel.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [HostelController],
  providers: [HostelService, PrismaService],
})
export class HostelModule {}
