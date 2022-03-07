import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {map, mergeMap, tap} from 'rxjs/operators';
import {from} from 'rxjs';
import * as ScheduleActions from '../actions/schedule.actions';
import {DateTime} from 'luxon';
import {environment} from '../../environments/environment';
import {createSchedule, updateSchedule} from '../actions/schedule.actions';
import {PouchDbService} from '../shared/services/infrastructure/pouch-db.service';
import {NotificationSchedulingService} from '../shared/services/application/notification-scheduling.service';

@Injectable()
export class ScheduleEffects {

  private db = this.pouchDbService.schedulesDb;

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

  $loadSchedules = createEffect(() => this.actions$.pipe(
    ofType(ScheduleActions.loadSchedules),
    tap(() => this.scheduleService.clearAndInitNotifications()
    )), {dispatch: false});

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

  $createdSchedule = createEffect(() => this.actions$.pipe(
    ofType(ScheduleActions.createSchedule),
  ), {dispatch: false});

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

  $updatedSchedule = createEffect(() => this.actions$.pipe(
    ofType(ScheduleActions.updateSchedule),
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
    private pouchDbService: PouchDbService,
    private scheduleService: NotificationSchedulingService
  ) {}

  dbSync(): void {
    console.log('DB SYNC SCHEDULE EFFECT');
    this.pouchDbService.syncDb(this.db, environment.pouchDbSchedulesPrefix);
  }
}
