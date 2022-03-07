import {ScheduleType} from './ScheduleDto';
import {DateTime} from 'luxon';
import {Schedule} from './Schedule';
import {Notification} from './Notification';
import {ScheduleOptions} from './ScheduleOptions';

export class HourlySchedule extends Schedule {
  hourlyInterval = 1;

  constructor(affirmationId: string, time: string, scheduleOptions: ScheduleOptions) {
    super(ScheduleType.HOURLY, affirmationId, time, scheduleOptions);
    if (scheduleOptions.count) {
      this.hourlyInterval = scheduleOptions.count;
    }
  }

  schedule(): Notification[] {
    let luxonTime = this.getTimeFromString();

    if (luxonTime.toMillis() <= DateTime.local().toMillis()) {
      luxonTime = luxonTime.plus({day: 1});
    }

    return [new Notification(this.generateNotificationId(), luxonTime, 'hour', this.hourlyInterval)];
  }
}
