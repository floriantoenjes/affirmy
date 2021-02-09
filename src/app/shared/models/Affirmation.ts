export class Affirmation {
  id: string;
  title: string;
  text: string;

  constructor(id: string, title: string, text: string) {
    this.id = id;
    this.title = title;
    this.text = text;
  }
}
