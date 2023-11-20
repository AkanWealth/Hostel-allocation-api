import { Student } from '@prisma/client';
import { AuthService } from './auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { CreateStudentDto } from 'src/student/dto/create-student.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerStudent(
    @Body()
    createStudent: CreateStudentDto,
  ) {
    return this.authService.registerStudent(createStudent);
  }

  @Post('login')
  async login(@Body() data: Student) {
    return this.authService.login(data);
  }
}
