import {Schedule} from './Schedule';

export class AffirmationDto {
  // tslint:disable-next-line:variable-name
  _id = new Date().toISOString();
  // tslint:disable-next-line:variable-name
  _rev = '';
  title: string;
  text: string;
  scheduled = false;
  scheduleModel: Schedule | undefined;

  constructor(title: string, text: string) {
    this.title = title;
    this.text = text;
  }

}
