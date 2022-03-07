import {ScheduleDto, ScheduleType} from './ScheduleDto';
import {DateTime} from 'luxon';
import {Notification} from './Notification';
import {ScheduleOptions} from './ScheduleOptions';

export abstract class Schedule extends ScheduleDto {

  protected constructor(scheduleType: ScheduleType, affirmationId: string, scheduleTime: string, scheduleOptions: ScheduleOptions) {
    super(scheduleType, affirmationId, scheduleTime, scheduleOptions);
  }

  abstract schedule(): Notification[];

  protected getTimeFromString(): DateTime {
    let luxonTime = DateTime.fromFormat(this.scheduleTime, 't');
    if (!luxonTime.isValid) {
      luxonTime = DateTime.fromFormat(this.scheduleTime, 'T');
    }
    console.log('LUXON TIME', luxonTime.toString(), DateTime.local().toString());
    return luxonTime;
  }

  protected generateNotificationId(): number {
    console.log('LN ID', new Date(this._id).getTime());
    return new Date(this._id).getTime();
  }

}
