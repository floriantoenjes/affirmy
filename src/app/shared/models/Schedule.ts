import {ScheduleDto} from './ScheduleDto';
import {DateTime} from 'luxon';
import {Notification} from './Notification';

export abstract class Schedule {

  abstract schedule(scheduleDto: ScheduleDto): Notification[];

  protected getTimeFromString(scheduleDto: ScheduleDto): DateTime {
    let luxonTime = DateTime.fromFormat(scheduleDto.scheduleTime, 't');
    if (!luxonTime.isValid) {
      luxonTime = DateTime.fromFormat(scheduleDto.scheduleTime, 'T');
    }
    console.log('LUXON TIME', luxonTime.toString(), DateTime.local().toString());
    return luxonTime;
  }

  protected generateNotificationId(scheduleDto: ScheduleDto): number {
    console.log('LN ID', new Date(scheduleDto._id).getTime());
    return new Date(scheduleDto._id).getTime();
  }

}
