import {DateTime} from 'luxon';
import {ScheduleType} from './ScheduleDto';

type Every = 'year' | 'month' | 'two-weeks' | 'week' | 'day' | 'hour' | 'minute' | 'second' | undefined;

export class Notification {
  type: ScheduleType;
  id: number;
  dateTime: DateTime;
  every: Every;
  count: number;

  constructor(type: ScheduleType, id: number, dateTime: DateTime, every: Every, count: number) {
    this.type = type;
    this.id = id;
    this.dateTime = dateTime;
    this.every = every;
    this.count = count;
  }
}
