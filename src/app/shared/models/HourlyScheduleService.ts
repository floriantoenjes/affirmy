import {Schedule} from './Schedule';
import {DateTime} from 'luxon';
import {ScheduleService} from './ScheduleService';
import {Notification} from './Notification';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class HourlyScheduleService extends ScheduleService {

  schedule(scheduleDto: Schedule): Notification[] {
    let luxonTime = this.getTimeFromString(scheduleDto);

    if (luxonTime.toMillis() <= DateTime.local().toMillis()) {
      luxonTime = luxonTime.plus({day: 1});
    }

    return [new Notification(this.generateNotificationId(scheduleDto), luxonTime, 'hour', scheduleDto.scheduleOptions.count)];
  }
}
