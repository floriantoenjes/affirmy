import {Component, OnInit, ViewChild} from '@angular/core';
import * as PouchDb from 'pouchdb-browser';
import {State} from './reducers';
import {Store} from '@ngrx/store';
import {fetchAffirmations} from './actions/affirmation.actions';
import {fetchSchedules} from './actions/schedule.actions';
import {AuthService} from './shared/services/auth.service';
import {Router} from '@angular/router';
import {PouchDbService} from './shared/services/pouch-db.service';
import {SpinnerService} from './shared/services/spinner.service';
import {MatSidenav} from '@angular/material/sidenav';
import {NavbarService} from './shared/services/navbar.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Plugins} from '@capacitor/core';
import {getSchedules} from './reducers/schedule.reducer';
import {Schedule, ScheduleType} from './shared/models/Schedule';
import {DateTime} from 'luxon';

const {LocalNotifications} = Plugins;

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
    private snackBar: MatSnackBar,
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

    this.initScheduleNotifications();
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

  logout(): void {
    this.authService.logout();
    this.snav?.close();
  }

  syncDbsManually(): void {
    // LocalNotifications.schedule({
    //   notifications: [{
    //     title: 'Affirmy',
    //     body: 'Hey, it is Affirmy!',
    //     id: 1,
    //     schedule: { at: new Date(Date.now() + 1000 * 5) },
    //     sound: undefined,
    //     attachments: undefined,
    //     actionTypeId: '',
    //     extra: null
    //   }]
    // }).then(() => console.log('SCHEDULED'));

    this.pouchDbService.syncDbs(
      () => {
        this.store.dispatch(fetchAffirmations());
      }, () => {
        this.store.dispatch(fetchAffirmations());
      }, () => {
        this.snackBar.open('Synchronized', 'Dismiss', {
          panelClass: ['bg-primary', 'text-center'],
          duration: 5000
        });
        this.store.dispatch(fetchSchedules());
      }, () => {
        this.store.dispatch(fetchSchedules());
      });
  }

  initScheduleNotifications(): void {
    this.store.select(getSchedules).subscribe(
      schedules => {
        for (const schedule of schedules) {
          if (schedule.active) {

            switch (schedule.scheduleType) {

              case ScheduleType.DAILY:
                this.scheduleDaily(schedule);
                break;
                // if (scheduleDate.toMillis() > Date.now()) {
                //   console.log('SCHEDULING on', scheduleDate.toJSDate());
                // }

              case ScheduleType.HOURLY:
                this.scheduleHourly(schedule);
                break;
            }
          }
        }
      }
    );
  }

  scheduleDaily(schedule: Schedule): void {
    const timeStrSplit = this.getTimeFromString(schedule.scheduleTime);
    let scheduleDate = DateTime.local();

    for (const weekDay of schedule.scheduleDays) {
      scheduleDate = scheduleDate.set({
        weekday: this.getWeekdayNumber(weekDay),
        hour: +timeStrSplit[0],
        minute: +timeStrSplit[1]
      });

      // TODO: Use 'repeat week' here
      console.log('SCHEDULING FOR', scheduleDate.toJSDate());
    }
  }

  scheduleHourly(schedule: Schedule): void {
    const timeStrSplit = this.getTimeFromString(schedule.scheduleTime);
    let scheduleDate = DateTime.local();
    scheduleDate = scheduleDate.set({
      hour: +timeStrSplit[0],
      minute: +timeStrSplit[1]
    });

    // TODO: Use every: minutes = 60 * hourlyInterval
    console.log('SCHEDULING FOR', scheduleDate.toJSDate());
  }

  getTimeFromString(timeStr: string): string[] {
    return timeStr.split(':');
  }

  getWeekdayNumber(weekday: string): number {
    switch (weekday) {
      case 'Monday':
        return 1;
      case 'Tuesday':
        return 2;
      case 'Wednesday':
        return 3;
      case 'Thursday':
        return 4;
      case 'Friday':
        return 5;
      case 'Saturday':
        return 6;
      case 'Sunday':
        return 7;
      default:
        return 0;
    }
  }

}
