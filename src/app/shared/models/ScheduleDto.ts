import {ScheduleOptions} from './ScheduleOptions';

export enum ScheduleType {
  DAILY,
  HOURLY
}

export class ScheduleDto {
  // tslint:disable-next-line:variable-name
  _id = new Date().toISOString();
  // tslint:disable-next-line:variable-name
  _rev = '';
  affirmationId: string;
  scheduleTime: string;
  scheduleType: ScheduleType;
  scheduleOptions: ScheduleOptions;

  constructor(scheduleType: ScheduleType, affirmationId: string, scheduleTime: string, scheduleOptions: ScheduleOptions) {
    this.scheduleType = scheduleType;
    this.affirmationId = affirmationId;
    this.scheduleTime = scheduleTime;
    this.scheduleOptions = scheduleOptions;
  }
}
