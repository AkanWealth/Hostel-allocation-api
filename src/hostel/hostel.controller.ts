import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { Hostel, Room, Student } from '@prisma/client';
import { HostelService } from './hostel.service';

@Controller('hostels')
export class HostelController {
  constructor(private readonly hostelService: HostelService) {}

  @Post('create-hostel')
  async createHostel(@Body() data: any): Promise<Hostel> {
    try {
      const createdHostel = await this.hostelService.createHostel(data);
      return createdHostel;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Post('create-room')
  async createRoom(@Body() roomData: any): Promise<Room> {
    try {
      const createdRoom = await this.hostelService.createRoom(roomData);
      return createdRoom;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Get()
  async findHostels(@Body() filter: any): Promise<Hostel[]> {
    try {
      const hostels = await this.hostelService.findHostels(filter);
      return hostels;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Get('search-hostels')
  async searchHostels(@Query('filter') filter: string): Promise<Hostel[]> {
    return this.hostelService.searchHostels(filter);
  }

  @Post('allocate-room/:studentId/:roomId')
  async allocateRoom(
    @Param('studentId') studentId: number,
    @Param('roomId') roomId: number,
  ): Promise<any> {
    try {
      const result = await this.hostelService.allocateRoom(studentId, roomId);
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Get('allocated-students')
  async listAllocatedStudents(): Promise<any> {
    try {
      const students = await this.hostelService.listAllocatedStudents();
      return students;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Delete('remove-student/:studentId')
  async removeStudentFromHostel(
    @Param('studentId') studentId: number,
  ): Promise<any> {
    try {
      const result =
        await this.hostelService.removeStudentFromHostel(studentId);
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Get(':hostelId/students')
  async getStudentsByHostel(@Param('hostelId') hostelId: number): Promise<any> {
    try {
      const students = await this.hostelService.getStudentsByHostel(hostelId);
      return students;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // @Post(':studentId/reassign/:newRoomId')
  // async reassignStudent(
  //   @Param('studentId') studentId: number,
  //   @Param('newRoomId') newRoomId: number,
  // ): Promise<Student> {
  //   return this.hostelService.reassignStudent(studentId, newRoomId);
  // }

  @Post(':studentId/reassign/:newRoomId/:newHostelId?')
  async reassignStudent(
    @Param('studentId') studentId: number,
    @Param('newRoomId') newRoomId: number,
    @Param('newHostelId') newHostelId?: number,
  ): Promise<Student> {
    try {
      return await this.hostelService.reassignStudent(
        studentId,
        newRoomId,
        newHostelId,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      console.error('Error in reassignStudent controller:', error);
      throw error;
    }
  }
}
