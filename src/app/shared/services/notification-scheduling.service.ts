import { Injectable } from '@angular/core';
import {getSchedules} from '../../reducers/schedule.reducer';
import {take} from 'rxjs/operators';
import {Schedule, ScheduleType} from '../models/Schedule';
import {DateTime} from 'luxon';
import {Plugins} from '@capacitor/core';
import {Store} from '@ngrx/store';
import {State} from '../../reducers';
import {getAffirmationById} from '../../reducers/affirmation.reducer';
import {Affirmation} from '../models/Affirmation';

const {LocalNotifications} = Plugins;

@Injectable({
  providedIn: 'root'
})
export class NotificationSchedulingService {

  constructor(private store: Store<State>) { }

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

    this.store.select(getSchedules).pipe(take(1)).subscribe(
      schedules => {
        console.log('SELECTOR SUBSCRIPTION', schedules.length);

        for (const schedule of schedules) {
          this.scheduleNotification(schedule);
        }
      }
    );
  }

  cancelNotification(schedule: Schedule): Promise<void> {
    return LocalNotifications.cancel({
      notifications: [
        {
          id: this.generateNotificationId(schedule).toString()
        }
      ]
    });
  }

  scheduleNotification(schedule: Schedule): void {
    // console.log('SCHEDULE ACTIVE?', schedule);
    if (schedule.active) {

      this.store.select(getAffirmationById, {id: schedule.affirmationId}).pipe(take(1)).subscribe(
        (affirmation) => {
          if (!affirmation) {
            return;
          }

          switch (schedule.scheduleType) {

            case ScheduleType.DAILY:
              this.scheduleDaily(schedule, affirmation);
              break;

            case ScheduleType.HOURLY:
              this.scheduleHourly(schedule, affirmation);
              break;
          }
        }
      );
    }
  }

  scheduleDaily(schedule: Schedule, affirmation: Affirmation): void {
    const luxonTime = this.getTimeFromString(schedule);

    for (const weekDay of schedule.scheduleDays) {
      let scheduleDate = luxonTime.set({
        weekday: this.getWeekdayNumber(weekDay),
      });

      if (scheduleDate.toMillis() <= DateTime.local().toMillis()) {
        scheduleDate = scheduleDate.plus({week: 1});
      }

      // TODO: Use 'repeat week' here
      console.log('SCHEDULING DAILY FOR', scheduleDate.toJSDate(), this.generateNotificationId(schedule));

      LocalNotifications.schedule({
        notifications: [{
          title: affirmation.title,
          body: affirmation.text,
          id: this.generateNotificationId(schedule),
          schedule: { at: scheduleDate.toUTC().toJSDate(), every: 'week' },
          sound: undefined,
          attachments: undefined,
          actionTypeId: '',
          extra: null
        }]
      }).then(() => console.log('SCHEDULED'));
    }
  }

  scheduleHourly(schedule: Schedule, affirmation: Affirmation): void {
    let luxonTime = this.getTimeFromString(schedule);

    if (luxonTime.toMillis() <= DateTime.local().toMillis()) {
      luxonTime = luxonTime.plus({day: 1});
    }

    console.log('SCHEDULING HOURLY FOR', luxonTime.toUTC().toJSDate(), this.generateNotificationId(schedule));

    LocalNotifications.schedule({
      notifications: [{
        title: affirmation.title,
        body: affirmation.text,
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
    console.log('LN ID', new Date(schedule._id).getTime());
    return new Date(schedule._id).getTime();
  }

  getTimeFromString(schedule: Schedule): DateTime {
    let luxonTime = DateTime.fromFormat(schedule.scheduleTime, 't');
    if (!luxonTime.isValid) {
      luxonTime = DateTime.fromFormat(schedule.scheduleTime, 'T');
    }
    console.log('LUXON TIME', luxonTime.toString(), DateTime.local().toString());
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
