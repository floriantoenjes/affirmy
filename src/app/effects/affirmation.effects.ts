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
import {createAffirmation, updateAffirmation} from '../actions/affirmation.actions';

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
    ofType(AffirmationActions.startCreateAffirmation),
    mergeMap(action => {
      const responseObs = from(this.db.put({...action.affirmation}));
      return responseObs.pipe(
        map(response => {
          return createAffirmation({affirmation: {...action.affirmation, _rev: response.rev}});
        })
      );
    }),
    tap(() => this.dbSync())
  ));

  $updateAffirmation = createEffect(() => this.actions$.pipe(
    ofType(AffirmationActions.startUpdateAffirmation),
    mergeMap(action => {
      const responseObs = from(this.db.put(action.affirmation));
      return responseObs.pipe(
        map(response => {
          const rev = response.rev;
          return updateAffirmation({affirmation: {...action.affirmation, _rev: rev}});
        })
      );
    }),
    tap(() => this.dbSync())
  ));

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
