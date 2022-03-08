import {ScheduleOptions} from './ScheduleOptions';

export enum ScheduleType {
  DAILY,
  HOURLY
}

export class Schedule {
  // tslint:disable-next-line:variable-name
  _id = new Date().toISOString();
  // tslint:disable-next-line:variable-name
  _rev = '';
  scheduleTime: string;
  scheduleType: ScheduleType;
  scheduleOptions: ScheduleOptions;

  constructor(scheduleType: ScheduleType, scheduleTime: string, scheduleOptions: ScheduleOptions) {
    this.scheduleType = scheduleType;
    this.scheduleTime = scheduleTime;
    this.scheduleOptions = scheduleOptions;
  }
}
