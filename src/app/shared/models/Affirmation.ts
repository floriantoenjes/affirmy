export class Affirmation {
  // tslint:disable-next-line:variable-name
  _id = new Date().toISOString();
  title: string;
  text: string;

  constructor(title: string, text: string) {
    this.title = title;
    this.text = text;
  }
}
