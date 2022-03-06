import {ScheduleType} from './ScheduleDto';
import {DateTime} from 'luxon';
import {Schedule} from './Schedule';

export class DailySchedule extends Schedule {
  scheduleDays: string[];

  constructor(affirmationId: string, time: string, scheduleDays: string[]) {
    super(ScheduleType.DAILY, affirmationId, time);
    this.scheduleDays = scheduleDays;
  }

  schedule(): DateTime[] {
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
