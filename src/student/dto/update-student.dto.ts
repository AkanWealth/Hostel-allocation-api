import { Room } from '@prisma/client';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateStudentDto {
  @IsOptional()
  id: number;

  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  fullname: string;

  @IsOptional()
  @IsNumber()
  age: number;

  @IsOptional()
  @IsString()
  department: string;

  @IsOptional()
  roomId: number;

  @IsOptional()
  room: Room;
}
