import {Schedule} from './Schedule';
import {AffirmationDto} from './AffirmationDto';
import {DailySchedule} from './DailySchedule';
import {HourlySchedule} from './HourlySchedule';
import {DateTime} from 'luxon';

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

  scheduleDaily(time: string, days: string[]): DateTime[] | void {
    const schedule = new DailySchedule(this._id, time, days);
    this.scheduleModel = schedule;
    this.scheduled = true;

    return schedule.schedule();
  }

  scheduleHourly(time: string, hourlyInterval: number): DateTime {
    const schedule = new HourlySchedule(this._id, time, hourlyInterval);
    this.scheduleModel = schedule;
    this.scheduled = true;

    return schedule.schedule();
  }

  cancelSchedule(): Schedule | void {
    this.scheduled = false;
    if (this.scheduleModel) {
      return this.scheduleModel;
    }
  }

  generateNotificationId(schedule: Schedule): number {
    console.log('LN ID', new Date(schedule._id).getTime());
    return new Date(schedule._id).getTime();
  }

  getTimeFromString(schedule: Schedule): DateTime {
    let luxonTime = DateTime.fromFormat(schedule.scheduleTime, 't');
    if (!luxonTime.isValid) {
      luxonTime = DateTime.fromFormat(schedule.scheduleTime, 'T');
    }
    console.log('LUXON TIME', luxonTime.toString(), DateTime.local().toString());
    return luxonTime;
  }

}
