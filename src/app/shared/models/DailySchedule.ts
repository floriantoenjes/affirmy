import {Schedule, ScheduleType} from './Schedule';

export class DailySchedule extends Schedule {
  scheduleDays: string[];

  constructor(affirmationId: string, scheduleTime: string, scheduleDays: string[]) {
    super(ScheduleType.DAILY, affirmationId, scheduleTime);
    this.scheduleDays = scheduleDays;
  }
}
