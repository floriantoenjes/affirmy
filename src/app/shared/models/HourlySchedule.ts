import {Schedule, ScheduleType} from './Schedule';
import {DateTime} from 'luxon';

export class HourlySchedule extends Schedule {
  hourlyInterval: number | undefined;

  constructor(affirmationId: string, scheduleTime: string, hourlyInterval: number) {
    super(ScheduleType.HOURLY, affirmationId, scheduleTime);
    this.hourlyInterval = hourlyInterval;
  }

  schedule(): DateTime {
    let luxonTime = this.getTimeFromString();

    if (luxonTime.toMillis() <= DateTime.local().toMillis()) {
      luxonTime = luxonTime.plus({day: 1});
    }

    return luxonTime;
  }
}
