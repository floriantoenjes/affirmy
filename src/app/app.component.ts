import {Component, OnInit} from '@angular/core';
import * as PouchDb from 'pouchdb-browser';
import {State} from './reducers';
import {Store} from '@ngrx/store';
import {fetchAffirmations} from './actions/affirmation.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'affirmy';

  constructor(private store: Store<State>) {
  }

  ngOnInit(): void {
    this.store.dispatch(fetchAffirmations());
  }
}
