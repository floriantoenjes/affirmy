import {ScheduleType} from './ScheduleDto';
import {DateTime} from 'luxon';
import {Schedule, ScheduleOptions} from './Schedule';
import {Notification} from './Notification';

export class DailySchedule extends Schedule {
  scheduleDays = ['Monday'];

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
        weekday: this.getWeekdayNumber(weekDay),
      });

      if (scheduleDate.toMillis() <= DateTime.local().toMillis()) {
        scheduleDate = scheduleDate.plus({week: 1});
      }

      const id = this.generateNotificationId() + this.getWeekdayNumber(scheduleDate.weekdayLong);

      notifications.push(new Notification(ScheduleType.DAILY, id, scheduleDate, 'week', 1));
    }

    return notifications;
  }
}
