import {Component, OnInit} from '@angular/core';
import * as PouchDb from 'pouchdb-browser';
import {State} from './reducers';
import {Store} from '@ngrx/store';
import {fetchAffirmations} from './actions/affirmation.actions';
import {fetchSchedules} from './actions/schedule.actions';
import {environment} from '../environments/environment';
import {AuthService} from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'affirmy';

  private affirmationDb = new PouchDB('affirmations2');
  private schedulesDb = new PouchDB('schedules2');

  constructor(
    private authService: AuthService,
    private store: Store<State>
  ) {
  }

  ngOnInit(): void {
    this.syncDbs();
  }

  syncDbs(): void {
    this.affirmationDb.sync(this.getRemoteDb(environment.pouchDbAffirmations))
      .then(() => this.store.dispatch(fetchAffirmations()))
      .catch((e) => this.store.dispatch(fetchAffirmations()));

    this.schedulesDb.sync(this.getRemoteDb(environment.pouchDbSchedules))
      .then(() => this.store.dispatch(fetchSchedules()))
      .catch((e) => this.store.dispatch(fetchSchedules()));
  }

  getRemoteDb(dbUri: string): PouchDB.Database {
    const db = new PouchDB(dbUri, {
      fetch: (url, opts) => {
        if (opts && this.authService.getJwt() !== '') {
          const headersWithAuth = new Headers(opts.headers);
          headersWithAuth.append('Authorization', `Bearer ${this.authService.getJwt()}`);
          opts.headers = headersWithAuth;
        }
        return PouchDB.fetch(url, opts);
      }
    });
    return db;
  }

}
