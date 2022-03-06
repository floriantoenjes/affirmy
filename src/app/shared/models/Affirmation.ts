import {ScheduleDto} from './ScheduleDto';
import {AffirmationDto} from './AffirmationDto';
import {DateTime} from 'luxon';
import {Schedule} from './Schedule';

export class Affirmation extends AffirmationDto{

  scheduleModel?: Schedule;

  constructor(affirmationDto: AffirmationDto) {
    super(affirmationDto.title, affirmationDto.text);
    Object.assign(this, affirmationDto);
    if (this.scheduleDto) {
      this.scheduleModel = new Schedule(this.scheduleDto);
    }
  }

  schedule(schedule?: Schedule): DateTime[] {
    this.scheduled = true;
    if (this.scheduleModel && !schedule) {
      return this.scheduleModel.schedule();
    } else if (schedule) {
      this.scheduleModel = schedule;
      this.scheduleDto = schedule;

      return this.scheduleModel.schedule();
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
