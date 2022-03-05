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
  scheduleType: ScheduleType;
  scheduleDays: string[];
  scheduleTime: string;
  hourlyInterval: number | undefined;


  constructor(affirmationId: string, scheduleType: ScheduleType, scheduleDays: string[], scheduleTime: string) {
    this.affirmationId = affirmationId;
    this.scheduleType = scheduleType;
    this.scheduleDays = scheduleDays;
    this.scheduleTime = scheduleTime;
  }
}
