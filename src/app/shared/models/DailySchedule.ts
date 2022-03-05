import {Schedule, ScheduleType} from './Schedule';
import {DateTime} from 'luxon';

export class DailySchedule extends Schedule {
  scheduleDays: string[];

  constructor(affirmationId: string, scheduleTime: string, scheduleDays: string[]) {
    super(ScheduleType.DAILY, affirmationId, scheduleTime);
    this.scheduleDays = scheduleDays;
  }

  schedule(): DateTime[] | void {
    const luxonTime = this.getTimeFromString();

    const scheduleDays = [];
    for (const weekDay of this.scheduleDays) {
      let scheduleDate = luxonTime.set({
        weekday: this.getWeekdayNumber(weekDay),
      });

      if (scheduleDate.toMillis() <= DateTime.local().toMillis()) {
        scheduleDate = scheduleDate.plus({week: 1});
      }

      scheduleDays.push(scheduleDate);
    }

    return scheduleDays;
  }
}
