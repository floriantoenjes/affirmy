import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {map, mergeMap, tap} from 'rxjs/operators';
import {from, of} from 'rxjs';
import * as ScheduleActions from '../actions/schedule.actions';
import {DateTime} from 'luxon';
import {environment} from '../../environments/environment';

@Injectable()
export class ScheduleEffects {

  db = new PouchDB('schedules2');

  $fetchSchedules = createEffect(() => this.actions$.pipe(
    ofType(ScheduleActions.fetchSchedules),
    mergeMap(() => {
      return from(this.db.allDocs({
        include_docs: true, descending: true
      }));
    }),
    map(docs => {
      const schedules = docs.rows.map(row => row.doc);
      return ({type: '[Schedule] Load', schedules});
    }),
    tap(() => this.dbSync())
  ));

  $createSchedule = createEffect(() => this.actions$.pipe(
    ofType(ScheduleActions.createSchedule),
    tap(action => {
      const schedule = action.schedule;
      const scheduleDt = DateTime.fromISO(schedule.scheduleTime);
      console.log('Scheduling...', scheduleDt.toISOTime());
      this.db.put({...schedule});
    }),
    tap(() => this.dbSync())
  ), {dispatch: false});

  $updateSchedule = createEffect(() => this.actions$.pipe(
    ofType(ScheduleActions.updateSchedule),
    tap(action => {
      const schedule = action.schedule;
      const scheduleDt = DateTime.fromISO(schedule.scheduleTime);
      console.log('Rescheduling...', scheduleDt.toISOTime());
      this.db.put(schedule);
    }),
    tap(() => this.dbSync())
  ), {dispatch: false});

  $deleteSchedule = createEffect(() => this.actions$.pipe(
    ofType(ScheduleActions.deleteSchedule),
    tap(action => {
      const schedule = action.schedule;

      const scheduleDt = DateTime.fromISO(schedule.scheduleTime);
      console.log('Rescheduling...', scheduleDt.toISOTime());

      this.db.remove(schedule);
    }),
    tap(() => this.dbSync())
  ), {dispatch: false});

  constructor(
    private actions$: Actions,
  ) {}

  dbSync(): void {
    console.log('DB SYNC SCHEDULE EFFECT');
    this.db.sync(environment.pouchDbSchedules);
  }
}
