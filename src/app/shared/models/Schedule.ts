import {Affirmation} from './Affirmation';
import {Time} from '@angular/common';

export enum ScheduleType {
  DAILY,
  HOURLY
}

export class Schedule {
  id: number;
  affirmationId: number;
  active: boolean;
  scheduleType: ScheduleType;
  scheduleDays: string[];
  scheduleTime: string;


  constructor(id: number, affirmationId: number, active: boolean,
              scheduleType: ScheduleType, scheduleDays: string[], scheduleTime: string) {
    this.id = id;
    this.affirmationId = affirmationId;
    this.active = active;
    this.scheduleType = scheduleType;
    this.scheduleDays = scheduleDays;
    this.scheduleTime = scheduleTime;
  }
}
