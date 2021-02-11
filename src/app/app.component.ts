import {Component, OnInit} from '@angular/core';
import * as PouchDb from 'pouchdb-browser';
import {State} from './reducers';
import {Store} from '@ngrx/store';
import {fetchAffirmations} from './actions/affirmation.actions';
import {fetchSchedules} from './actions/schedule.actions';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'affirmy';

  constructor(private store: Store<State>) {
  }

  ngOnInit(): void {
    new PouchDB('affirmations2').sync(environment.pouchDbAffirmations)
      .then(() => this.store.dispatch(fetchAffirmations()))
      .catch((e) => this.store.dispatch(fetchAffirmations()));

    new PouchDB('schedules2').sync(environment.pouchDbSchedules)
      .then(() => this.store.dispatch(fetchSchedules()))
      .catch((e) => this.store.dispatch(fetchSchedules()));
  }
}
