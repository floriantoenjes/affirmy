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
    const jwt = this.authService.getJwt();

    if (!jwt) {
      return;
    }

    const dbSuffix = (this.authService.decodeJwt(jwt) as any).db;

    const affirmationsDbUri = `http://192.168.2.111:5984/affirmations-${dbSuffix}`;
    const schedulesDbUri = `http://192.168.2.111:5984/schedules-${dbSuffix}`;

    this.affirmationDb.sync(this.getRemoteDb(affirmationsDbUri))
      .then(() => this.store.dispatch(fetchAffirmations()))
      .catch((e) => this.store.dispatch(fetchAffirmations()));

    this.schedulesDb.sync(this.getRemoteDb(schedulesDbUri))
      .then(() => this.store.dispatch(fetchSchedules()))
      .catch((e) => this.store.dispatch(fetchSchedules()));
  }

  getRemoteDb(dbUri: string): PouchDB.Database {
    const db = new PouchDB(dbUri, {
      fetch: (url, opts) => {
        console.log('opts outer');

        if (opts && this.authService.getJwt() !== '') {
          console.log('opts inner');

          const headersWithAuth = new Headers(opts.headers);
          headersWithAuth.append('Authorization', `Bearer ${this.authService.getJwt()}`);
          opts.headers = headersWithAuth;

          console.log('HEADERS', opts.headers.get('Authorization'));

          return PouchDB.fetch(url, opts);
        }
        console.log('HEADERS', opts);

        return PouchDB.fetch(url, opts);
      }
    });
    return db;
  }

}
