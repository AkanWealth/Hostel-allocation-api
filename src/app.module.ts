import { Module } from '@nestjs/common';
import { StudentModule } from './student/student.module';
import { HostelModule } from './hostel/hostel.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'newsecrethidden',
      signOptions: { expiresIn: '1d' },
    }),
    StudentModule,
    HostelModule,
    AuthModule,
  ],
  controllers: [],
})
export class AppModule {}
