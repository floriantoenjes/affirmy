import {ScheduleDto, ScheduleType} from './ScheduleDto';
import {DateTime} from 'luxon';
import {Notification} from './Notification';

export class Schedule extends ScheduleDto {

  constructor(scheduleType: ScheduleType, affirmationId: string, scheduleTime: string) {
    super(scheduleType, affirmationId, scheduleTime);
  }

  schedule(): Notification[] {
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

  generateNotificationId(): number {
    console.log('LN ID', new Date(this._id).getTime());
    return new Date(this._id).getTime();
  }


  getWeekdayNumber(weekday: string): number {
    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return weekDays.indexOf(weekday) + 1;
  }
}
