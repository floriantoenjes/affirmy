import {Schedule, ScheduleType} from './Schedule';

export class Affirmation {
  // tslint:disable-next-line:variable-name
  _id = new Date().toISOString();
  // tslint:disable-next-line:variable-name
  _rev = '';
  title: string;
  text: string;
  scheduled = false;
  scheduleModel!: Schedule;

  constructor(title: string, text: string) {
    this.title = title;
    this.text = text;
  }

  schedule(type: ScheduleType, days: string[], time: string): Schedule {
    this.scheduleModel = new Schedule(this._id, type, days, time);
    this.scheduled = true;

    return this.scheduleModel;
  }

  cancelSchedule(): Schedule {
    this.scheduled = false;

    return this.scheduleModel;
  }
}
