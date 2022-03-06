import {ScheduleDto, ScheduleType} from './ScheduleDto';
import {DateTime} from 'luxon';

export class Schedule extends ScheduleDto {

  constructor(scheduleType: ScheduleType, affirmationId: string, scheduleTime: string) {
    super(scheduleType, affirmationId, scheduleTime);
  }

  schedule(): DateTime[] {
    throw new Error('No implementation');
  }

  getTimeFromString(): DateTime {
    let luxonTime = DateTime.fromFormat(this.scheduleTime, 't');
    if (!luxonTime.isValid) {
      luxonTime = DateTime.fromFormat(this.scheduleTime, 'T');
    }
    console.log('LUXON TIME', luxonTime.toString(), DateTime.local().toString());
    return luxonTime;
  }

  getWeekdayNumber(weekday: string): number {
    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return weekDays.indexOf(weekday) + 1;
  }
}
