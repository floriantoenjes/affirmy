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
    switch (weekday) {
      case 'Monday':
        return 1;
      case 'Tuesday':
        return 2;
      case 'Wednesday':
        return 3;
      case 'Thursday':
        return 4;
      case 'Friday':
        return 5;
      case 'Saturday':
        return 6;
      case 'Sunday':
        return 7;
      default:
        return 0;
    }
  }
}
