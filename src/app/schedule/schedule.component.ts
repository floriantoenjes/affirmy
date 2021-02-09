import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {Affirmation} from '../shared/models/Affirmation';
import {State} from '../reducers';
import {Store} from '@ngrx/store';
import {getAffirmationById} from '../reducers/affirmation.reducer';
import {FormControl, FormGroup} from '@angular/forms';
import {Schedule, ScheduleType} from '../shared/models/Schedule';
import {createSchedule} from '../actions/schedule.actions';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ScheduleComponent implements OnInit {

  affirmation$: Observable<Affirmation | undefined>;

  form: FormGroup = new FormGroup({
    type: new FormControl('daily'),
    time: new FormControl()
  });

  constructor(public route: ActivatedRoute, public router: Router, private store: Store<State>) {
    this.affirmation$ = this.store.select(getAffirmationById, {id: route.snapshot.paramMap.get('id')});
  }

  ngOnInit(): void {
  }

  createSchedule(): void {
    console.log(this.form.value);
    const newSchedule = new Schedule(
      1,
      1,
      true,
      ScheduleType.HOURLY,
      [],
      this.form.get('time')?.value
    );
    this.store.dispatch(createSchedule({schedule: newSchedule}));
  }

}
