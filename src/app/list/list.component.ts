import {Component, OnInit} from '@angular/core';
import {Affirmation} from '../shared/models/Affirmation';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {State} from '../reducers';
import {getAffirmations} from '../reducers/affirmation.reducer';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  affirmations$: Observable<Affirmation[]>;

  constructor(store: Store<State>) {
    this.affirmations$ = store.select(getAffirmations);
  }

  ngOnInit(): void {
  }

}
