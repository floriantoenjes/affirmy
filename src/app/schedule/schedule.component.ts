import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {Affirmation} from '../shared/models/Affirmation';
import {State} from '../reducers';
import {Store} from '@ngrx/store';
import {getAffirmationById} from '../reducers/affirmation.reducer';
import {FormControl, FormGroup} from '@angular/forms';
import {Schedule, ScheduleType} from '../shared/models/Schedule';
import {tap} from 'rxjs/operators';
import {MatListOption} from '@angular/material/list';
import {AffirmationService} from '../shared/models/AffirmationService';
import {startUpdateAffirmation} from '../actions/affirmation.actions';
import {DailySchedule} from '../shared/models/DailySchedule';
import {ScheduleOptions} from '../shared/models/ScheduleOptions';

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

  originalScheduleDays: number[] = [];
  scheduleDays: number[] = [];

  changed = false;

  form: FormGroup = new FormGroup({
    type: new FormControl(typeof DailySchedule),
    time: new FormControl(),
    hourlyInterval: new FormControl(),
  });

  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  constructor(public route: ActivatedRoute, public router: Router, private store: Store<State>) {
    this.affirmation$ = this.store.select(getAffirmationById, {id: route.snapshot.paramMap.get('id')}).pipe(
      tap(af => this.affirmation = af)
    );

    this.affirmation$.pipe(
      tap(affirmation => {
        console.log(affirmation?.scheduleDto);

        if (affirmation?.scheduleDto) {
          this.form.patchValue({time: affirmation.scheduleDto.scheduleTime});

          if (affirmation?.scheduleDto?.scheduleType === ScheduleType.DAILY) {
            const schedule = affirmation.scheduleDto;
            this.selectedType = ScheduleType.DAILY;
            this.scheduleDays = schedule.scheduleOptions.days;
            this.originalScheduleDays = schedule.scheduleOptions.days;
          } else if (affirmation.scheduleDto.scheduleType === ScheduleType.HOURLY) {
            const schedule = affirmation.scheduleDto;
            this.selectedType = ScheduleType.HOURLY;
            this.form.get('hourlyInterval')?.patchValue(schedule.scheduleOptions.count);
          }
        }
        this.schedule = affirmation?.scheduleDto;
      })
    ).subscribe();
  }

  ngOnInit(): void {
  }

  createSchedule(): void {
    console.log('CREATE OR UPDATE', this.schedule?._id);

    if (!this.affirmation) {
      throw new Error('No affirmation for scheduling present!');
    }

    let updatedAffirmation;

    switch (this.selectedType) {
      case ScheduleType.DAILY:
        updatedAffirmation = {...this.affirmation} as Affirmation;
        new AffirmationService().schedule(
          updatedAffirmation,
          new Schedule(ScheduleType.DAILY, updatedAffirmation._id, this.form.get('time')?.value,
            {days: this.scheduleDays} as ScheduleOptions)
        );
        break;

      case ScheduleType.HOURLY:
        updatedAffirmation = {...this.affirmation} as Affirmation;
        new AffirmationService().schedule(
          updatedAffirmation,
          new Schedule(ScheduleType.HOURLY, updatedAffirmation._id, this.form.get('time')?.value,
            {count: this.form.get('hourlyInterval')?.value} as ScheduleOptions)
        );
        break;

      default:
        throw new Error(`Unknown schedule type: ${this.selectedType} !`);
    }

    this.store.dispatch(startUpdateAffirmation({affirmation: {...updatedAffirmation}}));
    this.router.navigate(['..'], {relativeTo: this.route});
  }

  selectWeekDays(selectedWeekDays: MatListOption[]): void {
    const weekDays = selectedWeekDays.map(swd => this.days.indexOf(swd.value) + 1);
    if (this.schedule) {
      this.schedule = {...this.schedule, scheduleDays: weekDays} as Schedule;
    }
    this.showDaySelect = false;
    this.scheduleDays = weekDays;

    this.hasChanges();
  }

  isSelected(weekday: string): boolean {
    if (this.schedule?.scheduleType === ScheduleType.DAILY) {
      return !!this.schedule?.scheduleOptions.days.some(d => d === this.days.indexOf(weekday) + 1);
    }
    return false;
  }

  selectedWeekDaysAsString(): string | undefined {
    return this.scheduleDays.map(dayIndex => this.days[dayIndex - 1]).join(', ');
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

    if (formValue.type !== typeof this.schedule
      || formValue.time !== this.schedule?.scheduleTime
      || (formValue.type === ScheduleType.HOURLY &&
         formValue.hourlyInterval !== this.schedule?.scheduleOptions.count)
      || (formValue.type === ScheduleType.DAILY &&
         !this.arraysEqual(this.schedule?.scheduleOptions.days, this.originalScheduleDays))) {
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

  arraysEqual(a1: Array<number> | undefined, a2: Array<number> | undefined): boolean {
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
