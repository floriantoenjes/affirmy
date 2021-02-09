import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Affirmation} from '../shared/models/Affirmation';
import {Observable, of} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {State} from '../reducers';
import {getAffirmations} from '../reducers/affirmation.reducer';
import {filter, find, mergeMap} from 'rxjs/operators';

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
    return this.store.pipe(
      select(getAffirmations),
      mergeMap(af => af),
      find((af: Affirmation) => {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
          return af.id === +id;
        } else {
          return false;
        }
      })
    );
  }

  navigateToEdit(): void {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  navigateToSchedule(): void {
    this.router.navigate(['schedule'], {relativeTo: this.route});
  }
}
