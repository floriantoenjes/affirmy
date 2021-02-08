import {Component, OnInit} from '@angular/core';
import {Affirmation} from '../shared/models/Affirmation';
import {Store} from '@ngrx/store';
import * as fromAffirmations from '../reducers/affirmation.reducer';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  affirmations$: Observable<Affirmation[]>;

  constructor(store: Store<fromAffirmations.State>) {
    this.affirmations$ = store.select(fromAffirmations.selectAffirmations);
    console.log( typeof this.affirmations$);
  }

  ngOnInit(): void {
  }

}
