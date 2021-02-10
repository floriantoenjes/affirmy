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
  active: boolean;
  scheduleType: ScheduleType;
  scheduleDays: string[];
  scheduleTime: string;
  hourlyInterval: number | undefined;


  constructor(affirmationId: string, active: boolean,
              scheduleType: ScheduleType, scheduleDays: string[], scheduleTime: string) {
    this.affirmationId = affirmationId;
    this.active = active;
    this.scheduleType = scheduleType;
    this.scheduleDays = scheduleDays;
    this.scheduleTime = scheduleTime;
  }
}
