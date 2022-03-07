import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import * as AffirmationActions from '../actions/affirmation.actions';
import {createAffirmation, updateAffirmation} from '../actions/affirmation.actions';
import {map, mergeMap, tap} from 'rxjs/operators';
import {from} from 'rxjs';
import {environment} from '../../environments/environment';
import {Store} from '@ngrx/store';
import {State} from '../reducers';
import {PouchDbService} from '../shared/services/pouch-db.service';
import {AffirmationDto} from '../shared/models/AffirmationDto';
import {NotificationSchedulingService} from '../shared/services/notification-scheduling.service';
import {Affirmation} from '../shared/models/Affirmation';

@Injectable()
export class AffirmationEffects {

  private db = this.pouchDbService.affirmationDb;

  $fetchAffirmations = createEffect(() => this.actions$.pipe(
    ofType(AffirmationActions.fetchAffirmations),
    mergeMap(() => {
      console.log('fetching');
      return from(this.db.allDocs({
        include_docs: true, descending: true
      }));
    }),
    map(docs => {
      console.log('RESULTS', docs);
      const affirmations = docs.rows.map(row => row.doc);
      console.log('AFFS', affirmations);
      return ({type: '[Affirmation] Load', affirmations});
    }),
    tap(() => this.dbSync())
  ));

  $createAffirmation = createEffect(() => this.actions$.pipe(
    ofType(AffirmationActions.startCreateAffirmation),
    mergeMap(action => {
      const responseObs = from(this.db.put({...action.affirmation, scheduleModel: undefined}));
      return responseObs.pipe(
        map(response => {
          return createAffirmation({affirmation: {...action.affirmation, _rev: response.rev} as AffirmationDto});
        })
      );
    }),
    tap(() => this.dbSync())
  ));

  $updateAffirmation = createEffect(() => this.actions$.pipe(
    ofType(AffirmationActions.startUpdateAffirmation),
    mergeMap(action => {
      const responseObs = from(this.db.put({...action.affirmation, scheduleModel: undefined}));
      return responseObs.pipe(
        map(response => {
          const rev = response.rev;
          const updatedAffirmation = {...action.affirmation, _rev: rev} as AffirmationDto;

          if (updatedAffirmation.scheduled) {
            this.scheduleService.scheduleNotification(new Affirmation(updatedAffirmation));
          } else {
            this.scheduleService.cancelNotification(new Affirmation(updatedAffirmation));
          }

          return updateAffirmation({affirmation: updatedAffirmation});
        })
      );
    }),
    tap(() => this.dbSync())
  ));

  $deleteAffirmation = createEffect(() => this.actions$.pipe(
    ofType(AffirmationActions.deleteAffirmation),
    map(action => action.affirmation),
    tap((affirmation: AffirmationDto) => {
      this.db.remove(affirmation);
      if (affirmation.scheduled) {
        console.log('REMOVING SCHEDULE');
        this.scheduleService.cancelNotification(affirmation);
      }
      this.dbSync();
    }),
  ), {dispatch: false});

  constructor(
    private actions$: Actions,
    private pouchDbService: PouchDbService,
    private store: Store<State>,
    private scheduleService: NotificationSchedulingService
  ) {
  }

  dbSync(): void {
    console.log('DB SYNC AFFIRMATION EFFECT');
    this.pouchDbService.syncDb(this.db, environment.pouchDbAffirmationsPrefix);
  }
}
