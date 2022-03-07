import {ScheduleType} from './ScheduleDto';
import {DateTime} from 'luxon';
import {Schedule} from './Schedule';
import {Notification} from './Notification';
import {ScheduleOptions} from './ScheduleOptions';

export class DailySchedule extends Schedule {
  scheduleDays = [0];

  constructor(affirmationId: string, time: string, scheduleOptions: ScheduleOptions) {
    super(ScheduleType.DAILY, affirmationId, time, scheduleOptions);
    if (scheduleOptions.days) {
      this.scheduleDays = scheduleOptions.days;
    }
  }

  schedule(): Notification[] {
    const luxonTime = this.getTimeFromString();

    const notifications: Notification[] = [];
    for (const weekDay of this.scheduleDays) {
      let scheduleDate = luxonTime.set({
        weekday: weekDay
      });

      if (scheduleDate.toMillis() <= DateTime.local().toMillis()) {
        scheduleDate = scheduleDate.plus({week: 1});
      }

      const id = this.generateNotificationId() + scheduleDate.weekday;

      notifications.push(new Notification(id, scheduleDate, 'week', 1));
    }

    return notifications;
  }
}
