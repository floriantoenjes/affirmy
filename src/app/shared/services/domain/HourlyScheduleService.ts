import {Schedule, ScheduleType} from '../../models/Schedule';
import {DateTime} from 'luxon';
import {ScheduleService} from './ScheduleService';
import {Notification} from '../../models/Notification';
import {Injectable} from '@angular/core';
import {ScheduleOptions} from '../../models/ScheduleOptions';

@Injectable({providedIn: 'root'})
export class HourlyScheduleService extends ScheduleService {

  createSchedule(scheduleTime: string, scheduleOptions: ScheduleOptions): Schedule {
    if (!scheduleOptions.count) {
      throw new Error('Count option as hourly interval is needed!');
    }
    return new Schedule(ScheduleType.HOURLY, scheduleTime, scheduleOptions);
  }

  schedule(scheduleDto: Schedule): Notification[] {
    let luxonTime = this.getTimeFromString(scheduleDto);

    if (luxonTime.toMillis() <= DateTime.local().toMillis()) {
      luxonTime = luxonTime.plus({day: 1});
    }

    return [new Notification(this.generateNotificationId(scheduleDto), luxonTime, 'hour', scheduleDto.scheduleOptions.count)];
  }
}
