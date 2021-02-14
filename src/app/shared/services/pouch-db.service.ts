import { Injectable } from '@angular/core';
import {AuthService} from './auth.service';
import {fetchAffirmations} from '../../actions/affirmation.actions';
import {fetchSchedules} from '../../actions/schedule.actions';

@Injectable({
  providedIn: 'root'
})
export class PouchDbService {

  private affirmationDb = new PouchDB('affirmations2');
  private schedulesDb = new PouchDB('schedules2');

  constructor(
    private authService: AuthService
  ) { }

  syncDbs(
    successAffirmations: () => void,
    errorAffirmations: () => void,
    successSchedules: () => void,
    errorSchedules: () => void): void {

    if (!this.authService.isLoggedIn()) {
      return;
    }

    this.syncDb(this.affirmationDb, 'affirmations', successAffirmations, errorAffirmations);
    this.syncDb(this.schedulesDb, 'schedules', successSchedules, errorSchedules);
  }

  syncDb(pouchDb: PouchDB.Database, prefix: string, success: () => void, error: () => void): void {
    const jwt = this.authService.getJwt();

    if (!jwt) {
      return;
    }

    const dbSuffix = (this.authService.decodeJwt(jwt) as any).db;

    const dbUri = `http://192.168.2.111:5984/${prefix}-${dbSuffix}`;

    this.affirmationDb.sync(this.getRemoteDb(dbUri))
      .then(() => success())
      .catch((e) => error());
  }

  getRemoteDb(dbUri: string): PouchDB.Database {
    const db = new PouchDB(dbUri, {
      fetch: (url, opts) => {
        if (opts && this.authService.isLoggedIn()) {
          const headersWithAuth = new Headers(opts.headers);
          headersWithAuth.append('Authorization', `Bearer ${this.authService.getJwt()}`);
          opts.headers = headersWithAuth;

          return PouchDB.fetch(url, opts);
        }
        return PouchDB.fetch(url, opts);
      }
    });
    return db;
  }
}
