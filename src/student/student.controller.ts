import { Controller, Get, Body, Param, Put, UseGuards } from '@nestjs/common';
import { StudentService } from './student.service';
import { Student } from '@prisma/client';
import { UpdateStudentDto } from './dto/update-student.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getAllStudent(): Promise<Student[]> {
    return this.studentService.getAllStudent();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.studentService.getStudent(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.updateStudent(id, updateStudentDto);
  }
}
