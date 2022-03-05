import {Component, OnInit} from '@angular/core';
import {AffirmationDto} from '../shared/models/AffirmationDto';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {State} from '../reducers';
import {getAffirmations} from '../reducers/affirmation.reducer';
import {Router} from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  affirmations$: Observable<AffirmationDto[]>;

  constructor(public router: Router, store: Store<State>) {
    this.affirmations$ = store.select(getAffirmations);
  }

  ngOnInit(): void {
  }
}
