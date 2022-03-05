import {Schedule} from './Schedule';
import {AffirmationDto} from './AffirmationDto';
import {DailySchedule} from './DailySchedule';
import {HourlySchedule} from './HourlySchedule';

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

  scheduleDaily(time: string, days: string[]): Schedule {
    this.scheduleModel = new DailySchedule(this._id, time, days);
    this.scheduled = true;

    return this.scheduleModel;
  }

  scheduleHourly(time: string, hourlyInterval: number): Schedule {
    this.scheduleModel = new HourlySchedule(this._id, time, hourlyInterval);
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
