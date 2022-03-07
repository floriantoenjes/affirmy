import {Injectable, isDevMode} from '@angular/core';
import {AuthService} from '../application/auth.service';
import {environment} from '../../../../environments/environment';
import {ProgressBarService} from '../gui/progress-bar.service';

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

  // TODO: Much to refactor right here!

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

    let ranInTimeout = false;

    if (navigator.onLine) {
      setTimeout(() => {
        ranInTimeout = true;
        handler.cancel();
        this.progressBarService.stopSpinner();
      }, environment.dbSyncTimeoutInMs);
    }

    const handler = pouchDb.sync(this.getRemoteDb(dbUri));
    handler.then(() => {
        if (ranInTimeout && error) {
          error();
          return;
        }
        if (success) {
          success();
        }
      })
      .catch((e) => {
        console.log('Sync error', dbUri, e.toString());
        if (error) {
          error();
        }
      })
      .finally(() => this.progressBarService.stopSpinner());
  }

  getRemoteDb(dbUri: string): PouchDB.Database {
    return new PouchDB(dbUri, {
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
  }

  getDbName(): string {
    if (isDevMode()) {
      return this.authService.getJwt() ?? '';
    }
    const jwt = this.authService.getJwt();

    if (jwt) {
      return (this.authService.decodeJwt(jwt) as any).db;
    }

    return '';
  }
}
