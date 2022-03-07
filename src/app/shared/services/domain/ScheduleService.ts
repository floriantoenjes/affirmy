import {Schedule} from '../../models/Schedule';
import {DateTime} from 'luxon';
import {Notification} from '../../models/Notification';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export abstract class ScheduleService {

  abstract schedule(scheduleDto: Schedule): Notification[];

  protected getTimeFromString(scheduleDto: Schedule): DateTime {
    let luxonTime = DateTime.fromFormat(scheduleDto.scheduleTime, 't');
    if (!luxonTime.isValid) {
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
