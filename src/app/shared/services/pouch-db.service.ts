import { Injectable } from '@angular/core';
import {AuthService} from './auth.service';
import {environment} from '../../../environments/environment';
import {ProgressBarService} from './progress-bar.service';

@Injectable({
  providedIn: 'root'
})
export class PouchDbService {

  affirmationDb = new PouchDB(`${environment.pouchDbAffirmationsPrefix}-${this.getDbName()}`);
  schedulesDb = new PouchDB(`${environment.pouchDbSchedulesPrefix}-${this.getDbName()}`);

  constructor(
    private authService: AuthService,
    private progressBarService: ProgressBarService,
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

    if (!this.authService.isLoggedIn()) {
      return;
    }

    this.progressBarService.startSpinner();

    const dbUri = `${environment.pouchDbUrl}/${prefix}-${this.getDbName()}`;

    pouchDb.sync(this.getRemoteDb(dbUri))
      .then(() => {
        if (success) {
          success();
        }
      })
      .catch((e) => {
        if (error) {
          error();
        }
      })
      .finally(() => this.progressBarService.stopSpinner());
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

  getDbName(): string {
    const jwt = this.authService.getJwt();

    if (jwt) {
      const dbSuffix = (this.authService.decodeJwt(jwt) as any).db;
      return dbSuffix;
    }

    return '';
  }
}
