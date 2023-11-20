import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.service';
import { StudentService } from 'src/student/student.service';
import { AuthController } from './auth.controller';
import { StudentModule } from 'src/student/student.module';

@Module({
  imports: [
    StudentModule,
    JwtModule.register({
      global: true,
      secret: 'newsecrethidden',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, StudentService, PrismaService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
