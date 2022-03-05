import {Schedule, ScheduleType} from './Schedule';
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

    const luxonTime = this.getTimeFromString(this.scheduleModel);

    const scheduleDays = [];
    for (const weekDay of schedule.scheduleDays) {
      let scheduleDate = luxonTime.set({
        weekday: this.getWeekdayNumber(weekDay),
      });

      if (scheduleDate.toMillis() <= DateTime.local().toMillis()) {
        scheduleDate = scheduleDate.plus({week: 1});
      }

      scheduleDays.push(scheduleDate);
    }

    return scheduleDays;
  }

  scheduleHourly(time: string, hourlyInterval: number): DateTime {
    const schedule = new HourlySchedule(this._id, time, hourlyInterval);
    this.scheduleModel = schedule;
    this.scheduled = true;

    let luxonTime = this.getTimeFromString(schedule);

    if (luxonTime.toMillis() <= DateTime.local().toMillis()) {
      luxonTime = luxonTime.plus({day: 1});
    }

    return luxonTime;
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

  getWeekdayNumber(weekday: string): number {
    switch (weekday) {
      case 'Monday':
        return 1;
      case 'Tuesday':
        return 2;
      case 'Wednesday':
        return 3;
      case 'Thursday':
        return 4;
      case 'Friday':
        return 5;
      case 'Saturday':
        return 6;
      case 'Sunday':
        return 7;
      default:
        return 0;
    }
  }
}
