import {ScheduleDto, ScheduleType} from './ScheduleDto';
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
  scheduleModel: ScheduleDto | undefined;

  constructor(affirmationDto: AffirmationDto) {
    super(affirmationDto.title, affirmationDto.text);
    Object.assign(this, affirmationDto);
  }

  scheduleDaily(time?: string, days?: string[]): DateTime[] {
    let schedule = null;
    if (this.scheduleModel?.scheduleType === ScheduleType.DAILY && !time && !days) {
      schedule = new DailySchedule(this.scheduleModel, (this.scheduleModel as DailySchedule).scheduleDays);
    } else if (time && days) {
      schedule = new DailySchedule(new ScheduleDto(ScheduleType.DAILY, this._id, time), days);
    } else if (!time || !days) {
      throw new Error('Time and days on first schedule needed!');
    } else {
      schedule = new DailySchedule(new ScheduleDto(ScheduleType.DAILY, this._id, time), days);
    }

    this.scheduled = true;
    this.scheduleModel = schedule;

    return schedule.schedule();

    /*let schedule = null;
    if (!this.scheduleModel || this.scheduleModel.scheduleType !== ScheduleType.DAILY) {
      if (!time || !days) {
        throw new Error('Time and days on first schedule needed!');
      }
      schedule = new DailySchedule(new ScheduleDto(ScheduleType.DAILY, this._id, time), days);
      this.scheduleModel = schedule;
    } else {
      schedule = new DailySchedule(this.scheduleModel, (this.scheduleModel as DailySchedule).scheduleDays);
    }
    this.scheduled = true;

    console.log(schedule);

    return schedule.schedule();
    */
  }

  scheduleHourly(time?: string, hourlyInterval?: number): DateTime[] {
    let schedule = null;
    if (this.scheduleModel?.scheduleType === ScheduleType.HOURLY && !time && !hourlyInterval) {
      schedule = new HourlySchedule(this.scheduleModel, (this.scheduleModel as HourlySchedule).hourlyInterval);
    } else if (time && hourlyInterval) {
      schedule = new HourlySchedule(new ScheduleDto(ScheduleType.HOURLY, this._id, time), hourlyInterval);
    } else if (!time || !hourlyInterval) {
      throw new Error('Time and hourly interval on first schedule needed!');
    } else {
      schedule = new HourlySchedule(new ScheduleDto(ScheduleType.HOURLY, this._id, time), hourlyInterval);
    }

    this.scheduled = true;
    this.scheduleModel = schedule;

    return schedule.schedule();

    /*let schedule = null;
    if (!this.scheduleModel || this.scheduleModel.scheduleType !== ScheduleType.HOURLY) {
      if (!time || !hourlyInterval) {
        throw new Error('Time and hourly interval on first schedule needed!');
      }
      schedule = new HourlySchedule(new ScheduleDto(ScheduleType.HOURLY, this._id, time), hourlyInterval);
      this.scheduleModel = schedule;
    } else {
      schedule = new HourlySchedule(this.scheduleModel, (this.scheduleModel as HourlySchedule).hourlyInterval);
    }
    this.scheduled = true;

    console.log(schedule);

    return schedule.schedule();
    */
  }

  cancelSchedule(): ScheduleDto | void {
    this.scheduled = false;
    if (this.scheduleModel) {
      return this.scheduleModel;
    }
  }

}
