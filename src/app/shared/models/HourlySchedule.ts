import {ScheduleType} from './ScheduleDto';
import {DateTime} from 'luxon';
import {Schedule} from './Schedule';

export class HourlySchedule extends Schedule {
  hourlyInterval: number;

  constructor(affirmationId: string, time: string, hourlyInterval: number) {
    super(ScheduleType.HOURLY, affirmationId, time);
    this.hourlyInterval = hourlyInterval;
  }

  schedule(): DateTime[] {
    let luxonTime = this.getTimeFromString();

    if (luxonTime.toMillis() <= DateTime.local().toMillis()) {
      luxonTime = luxonTime.plus({day: 1});
    }

    return [luxonTime];
  }
}
