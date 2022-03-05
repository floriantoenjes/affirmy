import {Schedule, ScheduleType} from './Schedule';
import {AffirmationDto} from './AffirmationDto';

export class Affirmation extends AffirmationDto{
  // tslint:disable-next-line:variable-name
  _id = new Date().toISOString();
  // tslint:disable-next-line:variable-name
  _rev = '';
  title!: string;
  text!: string;
  scheduled = false;
  scheduleModel: Schedule | undefined;

  constructor(affirmationDto: AffirmationDto) {
    super(affirmationDto.title, affirmationDto.text);
    Object.assign(this, affirmationDto);
  }

  schedule(type: ScheduleType, days: string[], time: string): Schedule {
    this.scheduleModel = new Schedule(this._id, type, days, time);
    this.scheduled = true;

    return this.scheduleModel;
  }

  cancelSchedule(): Schedule | void {
    this.scheduled = false;
    if (this.scheduleModel) {
      return this.scheduleModel;
    }
  }
}
