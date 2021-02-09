import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {map, mergeMap, tap} from 'rxjs/operators';
import {of} from 'rxjs';

@Injectable()
export class ScheduleEffects {

  $registerSchedule = createEffect(() => this.actions$.pipe(
    ofType('[Schedule] Create'),
    tap(() => console.log('Scheduling...'))
  ), {dispatch: false});

  constructor(
    private actions$: Actions,
  ) {}
}
