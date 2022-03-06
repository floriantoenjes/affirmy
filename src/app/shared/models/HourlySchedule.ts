import {ScheduleDto} from './ScheduleDto';
import {DateTime} from 'luxon';
import {Schedule} from './Schedule';

export class HourlySchedule extends Schedule {
  hourlyInterval: number;

  constructor(scheduleDto: ScheduleDto, hourlyInterval: number) {
    super(scheduleDto);
    this.hourlyInterval = hourlyInterval;
  }

  static fromHourlyScheduleDto(scheduleDto: ScheduleDto): HourlySchedule {
    return new HourlySchedule(scheduleDto, (scheduleDto as HourlySchedule).hourlyInterval);
  }

  schedule(): DateTime[] {
    let luxonTime = this.getTimeFromString();

    if (luxonTime.toMillis() <= DateTime.local().toMillis()) {
      luxonTime = luxonTime.plus({day: 1});
    }

    return [luxonTime];
  }
}
