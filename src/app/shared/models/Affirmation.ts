import {ScheduleDto} from './ScheduleDto';
import {AffirmationDto} from './AffirmationDto';
import {Schedule} from './Schedule';
import {Notification} from './Notification';

export class Affirmation extends AffirmationDto{

  scheduleModel?: Schedule;

  constructor(affirmationDto: AffirmationDto) {
    super(affirmationDto.title, affirmationDto.text);
    Object.assign(this, affirmationDto);
  }

  schedule(schedule?: Schedule): Notification[] {
    this.scheduled = true;
    if (this.scheduleModel && !schedule) {
      return this.scheduleModel.schedule();
    } else if (schedule) {
      this.scheduleModel = schedule;
      this.scheduleDto = schedule;

      const notifications = this.scheduleModel.schedule();
      this.notifications = notifications;

      return notifications;
    }
    throw new Error('A schedule model needs to be present!');
  }

  cancelSchedule(): ScheduleDto | void {
    this.scheduled = false;

    if (this.scheduleDto) {
      return this.scheduleDto;
    }
  }

}
