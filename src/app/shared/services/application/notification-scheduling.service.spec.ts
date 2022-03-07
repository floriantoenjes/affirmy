import { TestBed } from '@angular/core/testing';

import { NotificationSchedulingService } from './notification-scheduling.service';

describe('NotificationSchedulingService', () => {
  let service: NotificationSchedulingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationSchedulingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
