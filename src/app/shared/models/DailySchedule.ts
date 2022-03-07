import {ScheduleType} from './ScheduleDto';
import {DateTime} from 'luxon';
import {Schedule} from './Schedule';
import {Notification} from './Notification';

export class DailySchedule extends Schedule {
  scheduleDays: string[];

  constructor(affirmationId: string, time: string, scheduleDays: string[]) {
    super(ScheduleType.DAILY, affirmationId, time);
    this.scheduleDays = scheduleDays;
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
