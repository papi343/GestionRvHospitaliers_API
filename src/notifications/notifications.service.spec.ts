import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { NotificationsRepository } from './repositories/notifications.repository';

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(async () => {
    const mockNotificationsRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findByUserId: jest.fn(),
      findOne: jest.fn(),
      markAsRead: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: NotificationsRepository, useValue: mockNotificationsRepository },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
