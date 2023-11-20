import { Room } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateHostelDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  rooms: Room;
}
