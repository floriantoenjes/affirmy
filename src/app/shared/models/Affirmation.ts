import {Schedule} from './Schedule';
import {Notification} from './Notification';

export class Affirmation {
  // tslint:disable-next-line:variable-name
  _id = new Date().toISOString();
  // tslint:disable-next-line:variable-name
  _rev = '';
  title: string;
  text: string;
  scheduled = false;
  scheduleDto?: Schedule;

  notifications: Notification[] = [];

  constructor(title: string, text: string) {
    this.title = title;
    this.text = text;
  }

}
