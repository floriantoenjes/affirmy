import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {map, mergeMap, tap} from 'rxjs/operators';
import {from, of} from 'rxjs';
import * as ScheduleActions from '../actions/schedule.actions';
import {DateTime} from 'luxon';
import {environment} from '../../environments/environment';
import {createSchedule, updateSchedule} from '../actions/schedule.actions';
import {PouchDbService} from '../shared/services/pouch-db.service';

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
    ofType(ScheduleActions.startCreateSchedule),
    mergeMap(action => {
      const responseObs = from(this.db.put({...action.schedule}));
      return responseObs.pipe(
        map(response => {
          const schedule = action.schedule;
          const scheduleDt = DateTime.fromISO(schedule.scheduleTime);
          console.log('Scheduling...', scheduleDt.toISOTime());

          const rev = response.rev;
          return createSchedule({schedule: {...action.schedule, _rev: rev}});
        })
      );
    }),
    tap(() => this.dbSync())
  ));

  $updateSchedule = createEffect(() => this.actions$.pipe(
    ofType(ScheduleActions.startUpdateSchedule),
    mergeMap(action => {
      const schedule = action.schedule;
      const scheduleDt = DateTime.fromISO(schedule.scheduleTime);
      console.log('Rescheduling...', scheduleDt.toISOTime());
      const responseObs = from(this.db.put(schedule));

      return responseObs.pipe(
        map(response => {
          const rev = response.rev;
          return updateSchedule({schedule: {...action.schedule, _rev: rev}});
        })
      );
    }),
    tap(() => this.dbSync())
  ));

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
    private pouchDbService: PouchDbService
  ) {}

  dbSync(): void {
    console.log('DB SYNC SCHEDULE EFFECT');
    this.pouchDbService.syncDb(this.db, 'schedules');
  }
}
