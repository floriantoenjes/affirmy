import {Schedule, ScheduleType} from './Schedule';

export class HourlySchedule extends Schedule {
  hourlyInterval: number | undefined;

  constructor(affirmationId: string, scheduleTime: string, hourlyInterval: number) {
    super(ScheduleType.HOURLY, affirmationId, scheduleTime);
    this.hourlyInterval = hourlyInterval;
  }
}
