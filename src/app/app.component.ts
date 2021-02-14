import {Component, OnInit, ViewChild} from '@angular/core';
import * as PouchDb from 'pouchdb-browser';
import {State} from './reducers';
import {Store} from '@ngrx/store';
import {fetchAffirmations} from './actions/affirmation.actions';
import {fetchSchedules} from './actions/schedule.actions';
import {environment} from '../environments/environment';
import {AuthService} from './shared/services/auth.service';
import {Router} from '@angular/router';
import {PouchDbService} from './shared/services/pouch-db.service';
import {SpinnerService} from './shared/services/spinner.service';
import {MatSidenav} from '@angular/material/sidenav';
import {NavbarService} from './shared/services/navbar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'affirmy';

  @ViewChild('snav')
  private snav?: MatSidenav;

  constructor(
    private authService: AuthService,
    private navbarService: NavbarService,
    private pouchDbService: PouchDbService,
    private router: Router,
    public spinnerService: SpinnerService,
    private store: Store<State>
  ) {
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.syncDbs();
    }

    this.authService.loggedInSubject$.subscribe(loggedIn => {
      console.log('LOGGED IN SUBJECT', loggedIn);
      if (loggedIn) {
        this.syncDbs();
      } else {
        this.router.navigate(['/login']);
      }
    });

    this.navbarService.navbarToggled.subscribe(() => this.snav?.toggle());
  }

  syncDbs(): void {
    this.pouchDbService.syncDbs(
      () => {
        this.store.dispatch(fetchAffirmations());
      }, () => {
        this.store.dispatch(fetchAffirmations());
      }, () => {
        this.store.dispatch(fetchSchedules());
      }, () => {
        this.store.dispatch(fetchSchedules());
      });
  }

}
