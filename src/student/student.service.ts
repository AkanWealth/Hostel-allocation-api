import { Student } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class StudentService {
  constructor(private readonly prisma: PrismaService) {}

  async findByStudentID(studentID: string) {
    return this.prisma.student.findUnique({
      where: { studentID },
    });
  }

  async findById(id: number) {
    const student = await this.prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    return student;
  }

  async getAllStudent(): Promise<Student[]> {
    return this.prisma.student.findMany();
  }

  async getStudent(id: number): Promise<Student> {
    return this.prisma.student.findUnique({ where: { id: Number(id) } });
  }

  async updateStudent(id: number, updateStudentDto: UpdateStudentDto) {
    return this.prisma.student.update({
      where: { id },
      data: {
        password: updateStudentDto.password,
        fullname: updateStudentDto.fullname,
        age: updateStudentDto.age,
        department: updateStudentDto.department,
        room: {
          connect: {
            id: updateStudentDto.roomId,
          },
        },
      },
    });
  }
}
