import {Schedule} from '../../models/Schedule';
import {DateTime} from 'luxon';
import {Notification} from '../../models/Notification';
import {Injectable} from '@angular/core';
import {ScheduleOptions} from '../../models/ScheduleOptions';

@Injectable({providedIn: 'root'})
export abstract class ScheduleService {

  abstract createSchedule(scheduleTime: string, scheduleOptions: ScheduleOptions): Schedule;

  abstract schedule(scheduleDto: Schedule): Notification[];

  protected getTimeFromString(scheduleDto: Schedule): DateTime {
    let luxonTime;
    try {
      luxonTime = DateTime.fromFormat(scheduleDto.scheduleTime, 't');
      if (!luxonTime.isValid) {
        throw new Error();
      }
    } catch (err) {
      luxonTime = DateTime.fromFormat(scheduleDto.scheduleTime, 'T');
    }

    console.log('LUXON TIME', luxonTime.toString(), DateTime.local().toString());
    return luxonTime;
  }

  protected generateNotificationId(scheduleDto: Schedule): number {
    console.log('LN ID', new Date(scheduleDto._id).getTime());
    return new Date(scheduleDto._id).getTime();
  }

}
