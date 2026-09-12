import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationsRepository } from './repositories/notifications.repository';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly notificationsRepository: NotificationsRepository) {}

  async create(createNotificationDto: CreateNotificationDto) {
    return this.notificationsRepository.create(createNotificationDto);
  }

  async findAll() {
    return this.notificationsRepository.findAll();
  }

  async findByUserId(userId: number) {
    return this.notificationsRepository.findByUserId(userId);
  }

  async findOne(id: number) {
    const notification = await this.notificationsRepository.findOne(id);
    if (!notification) {
      throw new NotFoundException(`Notification #${id} introuvable.`);
    }
    return notification;
  }

  async markAsRead(id: number) {
    await this.findOne(id);
    return this.notificationsRepository.markAsRead(id);
  }

  async update(id: number, updateNotificationDto: UpdateNotificationDto) {
    await this.findOne(id);
    return this.notificationsRepository.update(id, updateNotificationDto);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.notificationsRepository.remove(id);
  }
}
