import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {Affirmation} from '../shared/models/Affirmation';
import {State} from '../reducers';
import {Store} from '@ngrx/store';
import {getAffirmationById} from '../reducers/affirmation.reducer';
import {FormControl, FormGroup} from '@angular/forms';
import {Schedule, ScheduleType} from '../shared/models/Schedule';
import {createSchedule, updateSchedule} from '../actions/schedule.actions';
import {map, mergeMap, tap} from 'rxjs/operators';
import {getScheduleById} from '../reducers/schedule.reducer';
import {MatListOption} from '@angular/material/list';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ScheduleComponent implements OnInit {

  affirmation$: Observable<Affirmation | undefined>;
  affirmationId: number | undefined;
  schedule: Schedule | undefined;
  showDaySelect = false;
  selectedType: ScheduleType = ScheduleType.DAILY;
  types = ScheduleType;

  form: FormGroup = new FormGroup({
    type: new FormControl('daily'),
    time: new FormControl(),
    hourlyInterval: new FormControl(),
  });

  constructor(public route: ActivatedRoute, public router: Router, private store: Store<State>) {
    this.affirmation$ = this.store.select(getAffirmationById, {id: route.snapshot.paramMap.get('id')}).pipe(
      tap(af => this.affirmationId = af?.id)
    );

    this.affirmation$.pipe(
      mergeMap(affirmation => {
        console.log('AFFIRM', affirmation);
        return this.store.select(getScheduleById, {id: affirmation?.id});
      }),
      map(result => {
        console.log('RESULT', result);
        if (result) {
          this.form.patchValue({time: result.scheduleTime, type: result.scheduleType});
          this.selectedType = result.scheduleType;
          this.form.get('hourlyInterval')?.patchValue(result.hourlyInterval);
        }
        this.schedule = result;
      })
    ).subscribe();
  }

  ngOnInit(): void {
  }

  createSchedule(): void {
    if (this.schedule) {
      const updatedSchedule = {
        ...this.schedule,
        scheduleType: this.selectedType,
        scheduleTime: this.form.get('time')?.value,
        hourlyInterval: this.form.get('hourlyInterval')?.value
      } as Schedule;
      this.store.dispatch(updateSchedule({schedule: updatedSchedule}));
    } else {
      if (!this.affirmationId) {
        return;
      }
      const newSchedule = new Schedule(
        1,
        this.affirmationId,
        true,
        this.selectedType,
        [],
        this.form.get('time')?.value
      );
      this.store.dispatch(createSchedule({schedule: newSchedule}));
    }
    this.router.navigate(['..'], {relativeTo: this.route});
  }

  selectWeekDays(selectedWeekDays: MatListOption[]): void {
    const weekDays = selectedWeekDays.map(swd => swd.value);
    if (this.schedule) {
      this.schedule = {...this.schedule, scheduleDays: weekDays} as Schedule;
    }
    this.showDaySelect = false;
  }

  isSelected(weekday: string): boolean {
    return !!this.schedule?.scheduleDays.some(d => d === weekday);
  }

  selectedWeekDaysAsString(): string | undefined {
    return this.schedule?.scheduleDays.join(', ');
  }

  switchType(): void {
    switch (this.form.get('type')?.value) {
      case 'daily':
        this.selectedType = ScheduleType.DAILY;
        break;
      case 'hourly':
        this.selectedType = ScheduleType.HOURLY;
        break;
    }
  }
}
