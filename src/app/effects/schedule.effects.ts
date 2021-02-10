import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {map, mergeMap, tap} from 'rxjs/operators';
import {of} from 'rxjs';
import * as ScheduleActions from '../actions/schedule.actions';
import {DateTime} from 'luxon';
import {environment} from '../../environments/environment';

@Injectable()
export class ScheduleEffects {

  db = new PouchDB('schedules2');
  actionPipe$ = this.actions$.pipe(tap(() => this.db.sync(environment.pouchDbSchedules)));

  $createSchedule = createEffect(() => this.actionPipe$.pipe(
    ofType(ScheduleActions.createSchedule),
    tap(action => {
      const schedule = action.schedule;
      const scheduleDt = DateTime.fromISO(schedule.scheduleTime);
      console.log('Scheduling...', scheduleDt.toISOTime());
      this.db.put({...schedule});
    })
  ), {dispatch: false});

  $updateSchedule = createEffect(() => this.actionPipe$.pipe(
    ofType(ScheduleActions.updateSchedule),
    tap(action => {
      const schedule = action.schedule;
      const scheduleDt = DateTime.fromISO(schedule.scheduleTime);
      console.log('Rescheduling...', scheduleDt.toISOTime());
    })
  ), {dispatch: false});

  $deleteSchedule = createEffect(() => this.actionPipe$.pipe(
    ofType(ScheduleActions.deleteSchedule),
    tap(action => {
      const schedule = action.schedule;

      const scheduleDt = DateTime.fromISO(schedule.scheduleTime);
      console.log('Rescheduling...', scheduleDt.toISOTime());

      this.db.remove(schedule);
    })
  ), {dispatch: false});

  constructor(
    private actions$: Actions,
  ) {}
}
