import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { PrismaService } from 'src/prisma.service';
import { StudentController } from './student.controller';

@Module({
  controllers: [StudentController],
  providers: [StudentService, PrismaService],
})
export class StudentModule {}
