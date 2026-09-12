import { Injectable } from '@nestjs/common';
import { Notification } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsRepository } from './notifications.repository';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { UpdateNotificationDto } from '../dto/update-notification.dto';

@Injectable()
export class PrismaNotificationsRepository implements NotificationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateNotificationDto): Promise<Notification> {
    return this.prisma.notification.create({
      data: {
        userId: createDto.userId,
        message: createDto.message,
      },
    });
  }

  async findAll(): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByUserId(userId: number): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number): Promise<Notification | null> {
    return this.prisma.notification.findUnique({
      where: { id },
    });
  }

  async markAsRead(id: number): Promise<Notification> {
    return this.prisma.notification.update({
      where: { id },
      data: { lu: true },
    });
  }

  async update(id: number, updateDto: UpdateNotificationDto): Promise<Notification> {
    const data: any = {};
    if (updateDto.userId !== undefined) data.userId = updateDto.userId;
    if (updateDto.message !== undefined) data.message = updateDto.message;
    if (updateDto.lu !== undefined) data.lu = updateDto.lu;

    return this.prisma.notification.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<Notification> {
    return this.prisma.notification.delete({
      where: { id },
    });
  }
}
