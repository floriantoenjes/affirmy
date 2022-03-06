import {ScheduleDto, ScheduleType} from './ScheduleDto';
import {AffirmationDto} from './AffirmationDto';
import {DailySchedule} from './DailySchedule';
import {HourlySchedule} from './HourlySchedule';
import {DateTime} from 'luxon';
import {Schedule} from './Schedule';

export class Affirmation extends AffirmationDto{

  constructor(affirmationDto: AffirmationDto) {
    super(affirmationDto.title, affirmationDto.text);
    Object.assign(this, affirmationDto);
  }

  scheduleDaily(time?: string, days?: string[]): DateTime[] {
    let schedule = null;
    if (this.scheduleModel?.scheduleType === ScheduleType.DAILY && !time && !days) {
      schedule = new DailySchedule(this.scheduleModel, (this.scheduleModel as DailySchedule).scheduleDays);
    } else if (!time || !days) {
      throw new Error('Time and days on first schedule needed!');
    } else {
      schedule = new DailySchedule(new ScheduleDto(ScheduleType.DAILY, this._id, time), days);
    }

    return this.scheduleAffirmation(schedule);
  }

  scheduleHourly(time?: string, hourlyInterval?: number): DateTime {
    let schedule = null;
    if (this.scheduleModel?.scheduleType === ScheduleType.HOURLY && !time && !hourlyInterval) {
      schedule = new HourlySchedule(this.scheduleModel, (this.scheduleModel as HourlySchedule).hourlyInterval);
    } else if (!time || !hourlyInterval) {
      throw new Error('Time and hourly interval on first schedule needed!');
    } else {
      schedule = new HourlySchedule(new ScheduleDto(ScheduleType.HOURLY, this._id, time), hourlyInterval);
    }

    return this.scheduleAffirmation(schedule)[0];
  }

  scheduleAffirmation(schedule: Schedule): DateTime[] {
    this.scheduled = true;
    this.scheduleModel = schedule;

    return schedule.schedule();
  }

  cancelSchedule(): ScheduleDto | void {
    this.scheduled = false;
    if (this.scheduleModel) {
      return this.scheduleModel;
    }
  }

}
