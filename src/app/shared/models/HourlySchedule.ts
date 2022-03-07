import {Schedule} from './Schedule';
import {DateTime} from 'luxon';
import {ScheduleService} from './ScheduleService';
import {Notification} from './Notification';

export class HourlySchedule extends ScheduleService {

  schedule(scheduleDto: Schedule): Notification[] {
    let luxonTime = this.getTimeFromString(scheduleDto);

    if (luxonTime.toMillis() <= DateTime.local().toMillis()) {
      luxonTime = luxonTime.plus({day: 1});
    }

    return [new Notification(this.generateNotificationId(scheduleDto), luxonTime, 'hour', scheduleDto.scheduleOptions.count)];
  }
}
