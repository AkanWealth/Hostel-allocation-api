import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { StudentService } from '../student/student.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateStudentDto } from 'src/student/dto/create-student.dto';
import { PrismaService } from 'src/prisma.service';
import { Student } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private studentsService: StudentService,
    private jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async registerStudent(
    studentData: CreateStudentDto,
  ): Promise<CreateStudentDto> {
    const existingStudent = await this.prisma.student.findUnique({
      where: { studentID: studentData.studentID },
    });

    if (existingStudent) {
      throw new NotFoundException(
        `Student with ${studentData.studentID} already exists`,
      );
    }

    const hashedPassword = await bcrypt.hash(studentData.password, 10);

    const newStudent = await this.prisma.student.create({
      data: {
        password: hashedPassword,
        fullname: studentData.fullname,
        age: studentData.age,
        studentID: studentData.studentID,
        department: studentData.department,
      },
    });

    const token = await this.login({
      studentID: studentData.studentID,
      fullname: studentData.fullname,
      id: newStudent.id,
    });

    return { ...newStudent, token };
  }

  async validateStudent(studentData: Partial<Student>): Promise<any> {
    const student = await this.studentsService.findByStudentID(
      studentData.studentID,
    );

    if (!student) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      studentData.password,
      student.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { studentID: student.studentID, sub: student.id };

    return { student, access_token: this.jwtService.sign(payload) };
  }

  async login(studentData: Partial<Student>) {
    const data = await this.studentsService.findByStudentID(
      studentData.studentID,
    );

    if (!data) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...payloadData } = data;

    const payload = { ...payloadData, sub: data.id };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async validateUserById(id: number): Promise<any> {
    return this.studentsService.findById(id);
  }
}
