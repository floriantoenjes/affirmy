import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {Affirmation} from '../shared/models/Affirmation';
import {State} from '../reducers';
import {Store} from '@ngrx/store';
import {getAffirmationById} from '../reducers/affirmation.reducer';
import {FormControl, FormGroup} from '@angular/forms';
import {Schedule, ScheduleType} from '../shared/models/Schedule';
import {startCreateSchedule, startUpdateSchedule} from '../actions/schedule.actions';
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
  affirmation: Affirmation | undefined;
  schedule: Schedule | undefined;
  showDaySelect = false;
  selectedType: ScheduleType = ScheduleType.DAILY;
  types = ScheduleType;

  originalScheduleDays: string[] = [];
  scheduleDays: string[] = [];

  changed = false;

  form: FormGroup = new FormGroup({
    type: new FormControl(ScheduleType.DAILY),
    time: new FormControl(),
    hourlyInterval: new FormControl(),
  });

  constructor(public route: ActivatedRoute, public router: Router, private store: Store<State>) {
    this.affirmation$ = this.store.select(getAffirmationById, {id: route.snapshot.paramMap.get('id')}).pipe(
      tap(af => this.affirmation = af)
    );

    this.affirmation$.pipe(
      mergeMap(affirmation => {
        return this.store.select(getScheduleById, {id: affirmation?._id});
      }),
      map(result => {
        if (result) {
          console.log('RESULT', result.scheduleType);
          this.form.patchValue({time: result.scheduleTime, type: result.scheduleType});
          this.selectedType = result.scheduleType;
          this.form.get('hourlyInterval')?.patchValue(result.hourlyInterval);
          this.scheduleDays = result.scheduleDays;
          this.originalScheduleDays = result.scheduleDays;
        }
        this.schedule = result;
      })
    ).subscribe();
  }

  ngOnInit(): void {
  }

  createSchedule(): void {
    console.log('CREATE OR UPDATE', this.schedule?._id);
    if (this.schedule?._id) {
      console.log('UPDATE SCHEDULE');
      const updatedSchedule = {
        ...this.schedule,
        scheduleType: this.selectedType,
        scheduleTime: this.form.get('time')?.value,
        hourlyInterval: this.form.get('hourlyInterval')?.value
      } as Schedule;
      this.store.dispatch(startUpdateSchedule({schedule: updatedSchedule}));
    } else {
      if (!this.affirmation) {
        return;
      }
      console.log('CREATE SCHEDULE');
      console.log(this.affirmation);
      const newSchedule = this.affirmation.schedule(
        this.selectedType,
        this.scheduleDays,
        this.form.get('time')?.value,
      );
      newSchedule.hourlyInterval = this.form.get('hourlyInterval')?.value;
      this.store.dispatch(startCreateSchedule({schedule: newSchedule}));
    }
    this.router.navigate(['..'], {relativeTo: this.route});
  }

  selectWeekDays(selectedWeekDays: MatListOption[]): void {
    const weekDays = selectedWeekDays.map(swd => swd.value);
    if (this.schedule) {
      this.schedule = {...this.schedule, scheduleDays: weekDays} as Schedule;
    }
    this.showDaySelect = false;
    this.scheduleDays = weekDays;

    this.hasChanges();
  }

  isSelected(weekday: string): boolean {
    return !!this.schedule?.scheduleDays.some(d => d === weekday);
  }

  selectedWeekDaysAsString(): string | undefined {
    return this.scheduleDays.join(', ');
  }

  switchType(): void {
    switch (this.form.get('type')?.value) {
      case 0:
        this.selectedType = ScheduleType.DAILY;
        this.form.get('type')?.patchValue(0);
        break;
      case 1:
        this.selectedType = ScheduleType.HOURLY;
        this.form.get('type')?.patchValue(1);
        break;
    }
    this.hasChanges();
  }

  hasChanges(): void {
    console.log('CHANGES', this.form.value, this.scheduleDays);

    const formValue = this.form.value;

    if (formValue.time === '' || formValue.time === null || (formValue.type === ScheduleType.HOURLY && !formValue.hourlyInterval)
      || (formValue.type === ScheduleType.DAILY && this.scheduleDays.length === 0)) {
      this.changed = false;
      return;
    }

    if (formValue.type !== this.schedule?.scheduleType
      || formValue.time !== this.schedule?.scheduleTime
      || (formValue.type === ScheduleType.HOURLY && formValue.hourlyInterval !== this.schedule?.hourlyInterval)
      || (formValue.type === ScheduleType.DAILY && !this.arraysEqual(this.schedule?.scheduleDays, this.originalScheduleDays))) {
      this.changed = true;
      console.log('CHANGED');
    } else {
      this.changed = false;
      console.log('NOT CHANGED');
    }
  }

  navigateBack(): void {
    this.router.navigate(['..'], {relativeTo: this.route});
  }

  arraysEqual(a1: Array<string> | undefined, a2: Array<string> | undefined): boolean {
    console.log(a1, a2);

    if (!a1 || !a2) {
      return false;
    }

    if (a1.length !== a2.length) {
      return false;
    }

    for (const element of a1) {
      if (a2.indexOf(element) === -1) {
        return false;
      }
    }
    return true;
  }
}
