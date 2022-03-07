import {ScheduleDto} from './ScheduleDto';
import {Notification} from './Notification';

export class AffirmationDto {
  // tslint:disable-next-line:variable-name
  _id = new Date().toISOString();
  // tslint:disable-next-line:variable-name
  _rev = '';
  title: string;
  text: string;
  scheduled = false;
  scheduleDto: ScheduleDto | undefined;

  notifications: Notification[] = [];

  constructor(title: string, text: string) {
    this.title = title;
    this.text = text;
  }

}
