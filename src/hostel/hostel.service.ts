import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Hostel, Room, Student } from '@prisma/client';

@Injectable()
export class HostelService {
  constructor(private readonly prisma: PrismaService) {}

  async createHostel(data: any): Promise<Hostel> {
    const { name } = data;
    const newHostel = await this.prisma.hostel.create({
      data: { name },
    });
    return newHostel;
  }

  async createRoom(data: any): Promise<Room> {
    const { name, capacity, status, hostelId } = data;
    const existingHostel = await this.prisma.hostel.findUnique({
      where: { id: hostelId },
    });

    if (!existingHostel) {
      throw new HttpException('Invalid Hostel ID', HttpStatus.BAD_REQUEST);
    }

    const newRoom = await this.prisma.room.create({
      data: {
        name,
        capacity,
        status,
        hostel: { connect: { id: hostelId } },
      },
    });

    return newRoom;
  }

  async findHostels(filter: any): Promise<Hostel[]> {
    const { available, name } = filter;
    const query = {
      where: {
        available: available,
        name: { contains: name },
      },
    };
    return this.prisma.hostel.findMany(query);
  }

  async searchHostels(filter: string): Promise<Hostel[]> {
    try {
      const query = {
        where: {
          OR: [
            { name: { contains: filter, mode: 'insensitive' as const } },
            {
              rooms: {
                some: {
                  students: {
                    some: {
                      fullname: {
                        contains: filter,
                        mode: 'insensitive' as const,
                      },
                    },
                  },
                },
              },
            },
          ],
        },
      };
      return await this.prisma.hostel.findMany(query);
    } catch (error) {
      throw error;
    }
  }

  async allocateRoom(studentId: number, roomId: number): Promise<Student> {
    try {
      const parsedRoomId = Number(roomId);

      if (isNaN(parsedRoomId) || parsedRoomId <= 0) {
        throw new HttpException('Invalid roomId', HttpStatus.BAD_REQUEST);
      }

      const room = await this.prisma.room.findUnique({
        where: { id: parsedRoomId },
        include: { students: true },
      });

      if (!room) {
        throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
      }

      if (room.students.length < room.capacity) {
        return await this.prisma.student.update({
          where: { id: Number(studentId) },
          data: { roomId: parsedRoomId },
        });
      } else {
        throw new HttpException('Room is full', HttpStatus.CONFLICT);
      }
    } catch (error) {
      console.error('Error in allocateRoom:', error);
    }
  }

  async listAllocatedStudents() {
    return await this.prisma.student.findMany({
      where: { roomId: { not: null } },
      include: { room: true },
    });
  }

  async removeStudentFromHostel(studentId: number): Promise<Student> {
    return this.prisma.student.update({
      where: { id: Number(studentId) },
      data: { roomId: null },
    });
  }

  async getStudentsByHostel(hostelId: number): Promise<Student[]> {
    try {
      const hostel = await this.prisma.hostel.findUnique({
        where: { id: Number(hostelId) },
        include: { rooms: { include: { students: true } } },
      });

      if (!hostel) {
        throw new HttpException('Hostel not found', HttpStatus.NOT_FOUND);
      }

      const students = hostel.rooms.flatMap((room) => room.students);

      return students;
    } catch (error) {
      throw error;
    }
  }

  async reassignStudent(
    studentId: number,
    newRoomId: number,
    newHostelId?: number,
  ): Promise<Student> {
    try {
      const newRoom = await this.prisma.room.findUnique({
        where: { id: Number(newRoomId) },
      });

      if (!newRoom) {
        throw new NotFoundException('New room not found');
      }

      if (newHostelId) {
        const newHostel = await this.prisma.hostel.findUnique({
          where: { id: Number(newHostelId) },
        });

        if (!newHostel) {
          throw new NotFoundException('New hostel not found');
        }
      }

      const updatedStudent = await this.prisma.student.update({
        where: { id: Number(studentId) },
        data: {
          room: {
            connect: { id: Number(newRoomId) },
            update: {
              hostelId: Number(newHostelId),
            },
          },
        },
      });

      return updatedStudent;
    } catch (error) {
      throw error;
    }
  }
}
