import { Injectable } from '@angular/core';
import {AuthService} from './auth.service';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PouchDbService {

  affirmationDb = new PouchDB('affirmations2');
  schedulesDb = new PouchDB('schedules2');

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

    this.syncDb(this.affirmationDb, environment.pouchDbAffirmationsPrefix, successAffirmations, errorAffirmations);
    this.syncDb(this.schedulesDb, environment.pouchDbSchedulesPrefix, successSchedules, errorSchedules);
  }

  syncDb(pouchDb: PouchDB.Database, prefix: string, success?: () => void, error?: () => void): void {
    const jwt = this.authService.getJwt();

    if (!jwt) {
      return;
    }

    const dbSuffix = (this.authService.decodeJwt(jwt) as any).db;

    const dbUri = `http://192.168.2.111:5984/${prefix}-${dbSuffix}`;

    this.affirmationDb.sync(this.getRemoteDb(dbUri))
      .then(() => {
        if (success) {
          success();
        }
      })
      .catch((e) => {
        if (error) {
          error();
        }
      });
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
