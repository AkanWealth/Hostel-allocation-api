import { Hostel } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateStudentDto {
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  fullname: string;

  @IsNotEmpty()
  @IsNumber()
  age: number;

  @IsNotEmpty()
  @IsString()
  studentID: string;

  @IsNotEmpty()
  @IsString()
  department: string;

  @IsOptional()
  hostelId?: number;

  @IsOptional()
  hostel?: Hostel;

  token: {
    access_token: string;
  };
}
