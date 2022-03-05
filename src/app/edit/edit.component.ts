import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {AffirmationDto} from '../shared/models/AffirmationDto';
import {select, Store} from '@ngrx/store';
import {State} from '../reducers';
import {getAffirmations} from '../reducers/affirmation.reducer';
import {find, mergeMap} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  affirmation$: Observable<AffirmationDto | undefined>;

  constructor(private route: ActivatedRoute, private store: Store<State>) {
    this.affirmation$ = store.pipe(
      select(getAffirmations),
      mergeMap(af => af),
      find((af: AffirmationDto) => {
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
