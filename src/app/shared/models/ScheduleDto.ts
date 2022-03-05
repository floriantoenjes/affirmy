
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

  constructor(scheduleType: ScheduleType, affirmationId: string, scheduleTime: string) {
    this.scheduleType = scheduleType;
    this.affirmationId = affirmationId;
    this.scheduleTime = scheduleTime;
  }
}
