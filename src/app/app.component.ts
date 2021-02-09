import {Component, OnInit} from '@angular/core';
import * as PouchDb from 'pouchdb-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'affirmy';

  ngOnInit(): void {
    const db = new PouchDB('affirmations');
    db.put({
      _id: new Date().toISOString(),
      title: 'Title',
      text: 'Text',
    }).then();

    console.log(db.allDocs({
      include_docs: true, descending: true
    }).then((result) => console.log(result)));
  }
}
