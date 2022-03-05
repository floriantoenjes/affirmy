import {DateTime} from 'luxon';

export enum ScheduleType {
  DAILY,
  HOURLY
}

export class Schedule {
  // tslint:disable-next-line:variable-name
  _id = new Date().toISOString();
  // tslint:disable-next-line:variable-name
  _rev = '';
  affirmationId: string;
  scheduleTime: string;
  scheduleType: ScheduleType;

  constructor(scheduleType: ScheduleType, affirmationId: string, scheduleTime: string) {
    this.scheduleType = scheduleType;
    this.affirmationId = affirmationId;
    this.scheduleTime = scheduleTime;
  }

  getTimeFromString(): DateTime {
    let luxonTime = DateTime.fromFormat(this.scheduleTime, 't');
    if (!luxonTime.isValid) {
      luxonTime = DateTime.fromFormat(this.scheduleTime, 'T');
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
