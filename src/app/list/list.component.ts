import {Component, OnInit} from '@angular/core';
import {Affirmation} from '../shared/models/Affirmation';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {State} from '../reducers';
import {getAffirmations} from '../reducers/affirmation.reducer';
import {Router} from '@angular/router';
import {AuthService} from '../shared/services/auth.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  affirmations$: Observable<Affirmation[]>;

  constructor(public router: Router, store: Store<State>, private authService: AuthService) {
    this.affirmations$ = store.select(getAffirmations);
  }

  ngOnInit(): void {
  }

  logout(): void {
    this.authService.logout();
  }

}
