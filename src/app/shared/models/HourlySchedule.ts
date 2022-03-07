import {ScheduleDto} from './ScheduleDto';
import {DateTime} from 'luxon';
import {Schedule} from './Schedule';
import {Notification} from './Notification';

export class HourlySchedule extends Schedule {

  schedule(scheduleDto: ScheduleDto): Notification[] {
    let luxonTime = this.getTimeFromString(scheduleDto);

    if (luxonTime.toMillis() <= DateTime.local().toMillis()) {
      luxonTime = luxonTime.plus({day: 1});
    }

    return [new Notification(this.generateNotificationId(scheduleDto), luxonTime, 'hour', scheduleDto.scheduleOptions.count)];
  }
}
