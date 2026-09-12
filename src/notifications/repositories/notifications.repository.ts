import { Notification } from '@prisma/client';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { UpdateNotificationDto } from '../dto/update-notification.dto';

export abstract class NotificationsRepository {
  abstract create(createDto: CreateNotificationDto): Promise<Notification>;
  abstract findAll(): Promise<Notification[]>;
  abstract findByUserId(userId: number): Promise<Notification[]>;
  abstract findOne(id: number): Promise<Notification | null>;
  abstract markAsRead(id: number): Promise<Notification>;
  abstract update(id: number, updateDto: UpdateNotificationDto): Promise<Notification>;
  abstract remove(id: number): Promise<Notification>;
}
