import {Injectable} from '@angular/core';
import {act, Actions, createEffect, ofType} from '@ngrx/effects';
import * as AffirmationActions from '../actions/affirmation.actions';
import {map, mergeMap, switchMap, tap, withLatestFrom} from 'rxjs/operators';
import {from, of} from 'rxjs';
import {environment} from '../../environments/environment';
import {Store} from '@ngrx/store';
import {State} from '../reducers';
import {deleteSchedule} from '../actions/schedule.actions';
import {getScheduleById} from '../reducers/schedule.reducer';

@Injectable()
export class AffirmationEffects {

  db = new PouchDB('affirmations2');
  scheduleDb = new PouchDB('schedules2');

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
    ofType(AffirmationActions.createAffirmation),
    map(action => {
      this.db.put({...action.affirmation});
    }),
    tap(() => this.dbSync())
  ), {dispatch: false});

  $updateAffirmation = createEffect(() => this.actions$.pipe(
    ofType(AffirmationActions.updateAffirmation),
    map(action => this.db.put(action.affirmation)),
    tap(() => this.dbSync())
  ), {dispatch: false});

  $deleteAffirmation = createEffect(() => this.actions$.pipe(
    ofType(AffirmationActions.deleteAffirmation),
    map(action => action.affirmation),
    mergeMap((affirmation) =>
        of(affirmation).pipe(
          withLatestFrom(
            this.store.select(getScheduleById, {id: affirmation._id})
          )
        ),
      (affirmation, schedule) => schedule
    ),
    switchMap(([affirmation, schedule]) => {
      this.db.remove(affirmation);
      if (schedule) {
        console.log('REMOVING SCHEDULE');
        this.scheduleDb.remove(schedule)
          .then((x) => console.log(x)).catch((e) => {
          console.log('SCHEDULE', e);
        });
      }
      return of();
    }),
    tap(() => this.dbSync())

  ), {dispatch: false});

  constructor(
    private actions$: Actions,
    private store: Store<State>
  ) {
  }

  dbSync(): void {
    console.log('DB SYNC AFFIRMATION EFFECT');
    this.db.sync(environment.pouchDbAffirmations);
  }
}
