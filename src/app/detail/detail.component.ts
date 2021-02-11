import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Affirmation} from '../shared/models/Affirmation';
import {Observable, of} from 'rxjs';
import {Store} from '@ngrx/store';
import {State} from '../reducers';
import {getAffirmationById} from '../reducers/affirmation.reducer';
import {deleteAffirmation} from '../actions/affirmation.actions';
import {Schedule} from '../shared/models/Schedule';
import {getScheduleById} from '../reducers/schedule.reducer';
import {tap} from 'rxjs/operators';
import {startUpdateSchedule, updateSchedule} from '../actions/schedule.actions';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  affirmation$: Observable<Affirmation | undefined>;
  schedule$: Observable<Schedule | undefined>;

  constructor(private route: ActivatedRoute, public router: Router, private store: Store<State>) {
    this.affirmation$ = this.getCurrentAffirmation();
    this.schedule$ = of();
  }

  ngOnInit(): void {
  }

  private getCurrentAffirmation(): Observable<Affirmation | undefined> {
    return this.store.select(getAffirmationById, {id: this.route.snapshot.paramMap.get('id')}).pipe(
      tap(af => this.schedule$ = this.store.select(getScheduleById, {id: af?._id}))
    );
  }

  navigateToEdit(): void {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  navigateToSchedule(): void {
    this.router.navigate(['schedule'], {relativeTo: this.route});
  }

  delete(affirmation: Affirmation): void {
    this.store.dispatch(deleteAffirmation({affirmation}));
    this.router.navigate(['..']);
  }

  changeActive($event: MatSlideToggleChange, schedule: Schedule): void {
    this.store.dispatch(startUpdateSchedule({schedule: {...schedule, active: $event.checked }}));
  }
}
