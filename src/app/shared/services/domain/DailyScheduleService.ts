import {Schedule, ScheduleType} from '../../models/Schedule';
import {DateTime} from 'luxon';
import {ScheduleService} from './ScheduleService';
import {Notification} from '../../models/Notification';
import {Injectable} from '@angular/core';
import {ScheduleOptions} from '../../models/ScheduleOptions';

@Injectable({providedIn: 'root'})
export class DailyScheduleService extends ScheduleService {


  createSchedule(scheduleTime: string, scheduleOptions: ScheduleOptions): Schedule {
    if (!scheduleOptions.days) {
      throw new Error('Days option is needed!');
    }

    return new Schedule(ScheduleType.DAILY, scheduleTime, scheduleOptions);
  }

  schedule(scheduleDto: Schedule): Notification[] {
    const luxonTime = this.getTimeFromString(scheduleDto);

    const notifications: Notification[] = [];
    for (const weekDay of scheduleDto.scheduleOptions.days) {
      let scheduleDate = luxonTime.set({
        weekday: weekDay
      });

      if (scheduleDate.toMillis() <= DateTime.local().toMillis()) {
        scheduleDate = scheduleDate.plus({week: 1});
      }

      const id = this.generateNotificationId(scheduleDto) + scheduleDate.weekday;

      notifications.push(new Notification(id, scheduleDate, 'week', 1));
    }

    return notifications;
  }
}
