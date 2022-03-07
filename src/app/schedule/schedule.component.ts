import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AffirmationDto} from '../shared/models/AffirmationDto';
import {State} from '../reducers';
import {Store} from '@ngrx/store';
import {getAffirmationById} from '../reducers/affirmation.reducer';
import {FormControl, FormGroup} from '@angular/forms';
import {ScheduleDto, ScheduleType} from '../shared/models/ScheduleDto';
import {tap} from 'rxjs/operators';
import {MatListOption} from '@angular/material/list';
import {Affirmation} from '../shared/models/Affirmation';
import {startUpdateAffirmation} from '../actions/affirmation.actions';
import {DailySchedule} from '../shared/models/DailySchedule';
import {HourlySchedule} from '../shared/models/HourlySchedule';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ScheduleComponent implements OnInit {

  affirmation$: Observable<AffirmationDto | undefined>;
  affirmation: AffirmationDto | undefined;
  schedule: ScheduleDto | undefined;
  showDaySelect = false;
  selectedType: ScheduleType = ScheduleType.DAILY;
  types = ScheduleType;

  originalScheduleDays: string[] = [];
  scheduleDays: string[] = [];

  changed = false;

  form: FormGroup = new FormGroup({
    type: new FormControl(typeof DailySchedule),
    time: new FormControl(),
    hourlyInterval: new FormControl(),
  });

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
            const schedule = affirmation.scheduleDto as DailySchedule;
            this.selectedType = ScheduleType.DAILY;
            this.scheduleDays = schedule.scheduleDays;
            this.originalScheduleDays = schedule.scheduleDays;
          } else if (affirmation.scheduleDto.scheduleType === ScheduleType.HOURLY) {
            const schedule = affirmation.scheduleDto as HourlySchedule;
            this.selectedType = ScheduleType.HOURLY;
            this.form.get('hourlyInterval')?.patchValue(schedule.hourlyInterval);
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
        updatedAffirmation = new Affirmation({...this.affirmation});
        updatedAffirmation.schedule(
          new DailySchedule(updatedAffirmation._id, this.form.get('time')?.value, {days: this.scheduleDays})
        );
        break;

      case ScheduleType.HOURLY:
        updatedAffirmation = new Affirmation({...this.affirmation});
        updatedAffirmation.schedule(
          new HourlySchedule(updatedAffirmation._id, this.form.get('time')?.value, this.form.get('hourlyInterval')?.value)
        );
        break;

      default:
        throw new Error(`Unknown schedule type: ${this.selectedType} !`);
    }

    this.store.dispatch(startUpdateAffirmation({affirmation: {...updatedAffirmation}}));
    this.router.navigate(['..'], {relativeTo: this.route});
  }

  selectWeekDays(selectedWeekDays: MatListOption[]): void {
    const weekDays = selectedWeekDays.map(swd => swd.value);
    if (this.schedule) {
      this.schedule = {...this.schedule, scheduleDays: weekDays} as ScheduleDto;
    }
    this.showDaySelect = false;
    this.scheduleDays = weekDays;

    this.hasChanges();
  }

  isSelected(weekday: string): boolean {
    if (this.schedule instanceof DailySchedule) {
      return !!this.schedule?.scheduleDays.some(d => d === weekday);
    }
    return false;
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

    if (formValue.type !== typeof this.schedule
      || formValue.time !== this.schedule?.scheduleTime
      || (formValue.type === ScheduleType.HOURLY &&
        this.schedule instanceof HourlySchedule && formValue.hourlyInterval !== this.schedule?.hourlyInterval)
      || (formValue.type === ScheduleType.DAILY &&
        this.schedule instanceof DailySchedule && !this.arraysEqual(this.schedule?.scheduleDays, this.originalScheduleDays))) {
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
