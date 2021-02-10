import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Affirmation} from '../shared/models/Affirmation';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {State} from '../reducers';
import {getAffirmationById} from '../reducers/affirmation.reducer';
import {deleteAffirmation} from '../actions/affirmation.actions';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  affirmation$: Observable<Affirmation | undefined>;

  constructor(private route: ActivatedRoute, public router: Router, private store: Store<State>) {
    this.affirmation$ = this.getCurrentAffirmation();
  }


  ngOnInit(): void {
  }

  private getCurrentAffirmation(): Observable<Affirmation | undefined> {
    return this.store.select(getAffirmationById, {id: this.route.snapshot.paramMap.get('id')});
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
}
