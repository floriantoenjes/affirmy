import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {map, mergeMap, tap} from 'rxjs/operators';
import {of} from 'rxjs';
import * as ScheduleActions from '../actions/schedule.actions';
import {DateTime} from 'luxon';

@Injectable()
export class ScheduleEffects {

  $registerSchedule = createEffect(() => this.actions$.pipe(
    ofType(ScheduleActions.createSchedule),
    tap(action => {
      const schedule = action.schedule;
      const scheduleDt = DateTime.fromISO(schedule.scheduleTime);
      console.log('Scheduling...', scheduleDt.toISOTime());
    })
  ), {dispatch: false});

  $updateSchedule = createEffect(() => this.actions$.pipe(
    ofType(ScheduleActions.updateSchedule),
    tap(action => {
      const schedule = action.schedule;
      const scheduleDt = DateTime.fromISO(schedule.scheduleTime);
      console.log('Rescheduling...', scheduleDt.toISOTime());
    })
  ), {dispatch: false});

  constructor(
    private actions$: Actions,
  ) {}
}
