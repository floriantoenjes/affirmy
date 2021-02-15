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
import {LocalNotificationPendingList, Plugins} from '@capacitor/core';
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

    this.clearAndInitNotifications(); // TODO: All which belongs to this goes into it's own service!
  }

  clearAndInitNotifications(): void {
    LocalNotifications.getPending().then(pending => {
      if (pending.notifications.length > 0) {
        LocalNotifications.cancel(pending).then(() => this.initScheduleNotifications());
      } else {
        this.initScheduleNotifications();
      }
    });
  }

  initScheduleNotifications(): void {
    console.log('INIT SCHEDULING');

    this.store.select(getSchedules).subscribe(
      schedules => {
        console.log('SELECTOR SUBSCRIPTION', schedules.length);

        for (const schedule of schedules) {
          this.scheduleNotification(schedule);
        }
      }
    );
  }

  scheduleNotification(schedule: Schedule): void {
    // console.log('SCHEDULE ACTIVE?', schedule);
    if (schedule.active) {

      switch (schedule.scheduleType) {

        case ScheduleType.DAILY:
          this.scheduleDaily(schedule);
          break;

        case ScheduleType.HOURLY:
          this.scheduleHourly(schedule);
          break;
      }
    }
  }

  scheduleDaily(schedule: Schedule): void {
    const luxonTime = this.getTimeFromString(schedule);

    for (const weekDay of schedule.scheduleDays) {
      const scheduleDate = luxonTime.set({
        weekday: this.getWeekdayNumber(weekDay),
      });

      // TODO: Use 'repeat week' here
      console.log('SCHEDULING FOR', scheduleDate.toJSDate(), this.generateNotificationId(schedule));

      LocalNotifications.schedule({
        notifications: [{
          title: 'Affirmy',
          body: 'Hey, it is daily Affirmy!',
          id: this.generateNotificationId(schedule),
          schedule: { at: scheduleDate.toJSDate(), every: 'week' },
          sound: undefined,
          attachments: undefined,
          actionTypeId: '',
          extra: null
        }]
      }).then(() => console.log('SCHEDULED'));
    }
  }

  scheduleHourly(schedule: Schedule): void {
    const luxonTime = this.getTimeFromString(schedule);

    // TODO: Use every: minutes = 60 * hourlyInterval
    console.log('SCHEDULING FOR', luxonTime.toJSDate(), this.generateNotificationId(schedule));

    LocalNotifications.schedule({
      notifications: [{
        title: 'Affirmy',
        body: 'Hey, it is hourly Affirmy!',
        id: this.generateNotificationId(schedule),
        schedule: { at: luxonTime.toJSDate(), every: 'hour' },
        sound: undefined,
        attachments: undefined,
        actionTypeId: '',
        extra: null
      }]
    }).then(() => console.log('SCHEDULED'));
  }

  generateNotificationId(schedule: Schedule): number {
    return new Date(schedule._id).getTime() / 1000;
  }

  getTimeFromString(schedule: Schedule): DateTime {
    let luxonTime = DateTime.fromFormat(schedule.scheduleTime, 't');
    if (!luxonTime.isValid) {
      luxonTime = DateTime.fromFormat(schedule.scheduleTime, 'T');
    }
    console.log('LUXON TIME', luxonTime);
    return luxonTime;
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
