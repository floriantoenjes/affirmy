import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {Affirmation} from '../shared/models/Affirmation';
import {select, Store} from '@ngrx/store';
import {State} from '../reducers';
import {getAffirmations} from '../reducers/affirmation.reducer';
import {filter, find, mergeMap} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {flatten} from '@angular/compiler';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  affirmation$: Observable<Affirmation | undefined>;

  constructor(private route: ActivatedRoute, private store: Store<State>) {
    this.affirmation$ = store.pipe(
      select(getAffirmations),
      mergeMap(af => af),
      find((af: Affirmation) => {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
          return af._id === id;
        } else {
          return false;
        }
      })
    );
  }

  ngOnInit(): void {
  }

}
