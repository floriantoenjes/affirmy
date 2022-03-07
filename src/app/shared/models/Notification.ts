import {DateTime} from 'luxon';

type Every = 'year' | 'month' | 'two-weeks' | 'week' | 'day' | 'hour' | 'minute' | 'second' | undefined;

export class Notification {
  id: number;
  dateTime: DateTime;
  every: Every;
  count: number;

  constructor(id: number, dateTime: DateTime, every: Every, count: number) {
    this.id = id;
    this.dateTime = dateTime;
    this.every = every;
    this.count = count;
  }
}
