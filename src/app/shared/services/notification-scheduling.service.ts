import {Injectable} from '@angular/core';
import {first} from 'rxjs/operators';
import {ScheduleType} from '../models/ScheduleDto';
import {Plugins} from '@capacitor/core';
import {Store} from '@ngrx/store';
import {State} from '../../reducers';
import {getAffirmations} from '../../reducers/affirmation.reducer';
import {AffirmationDto} from '../models/AffirmationDto';
import {Affirmation} from '../models/Affirmation';
import {DailySchedule} from '../models/DailySchedule';
import {HourlySchedule} from '../models/HourlySchedule';

const {LocalNotifications} = Plugins;

@Injectable({
  providedIn: 'root'
})
export class NotificationSchedulingService {

  constructor(private store: Store<State>) { }

  async clearAndInitNotifications(): Promise<void> {
    setTimeout(async () => {
      const pending = await LocalNotifications.getPending();
      if (pending.notifications.length > 0) {
        LocalNotifications.cancel(pending).then(() => this.initScheduleNotifications());
      } else {
        await this.initScheduleNotifications();
      }
    });
  }

  async initScheduleNotifications(): Promise<void> {
    console.log('INIT SCHEDULING');

    const affirmations = await this.store.select(getAffirmations).pipe(first()).toPromise();
    console.log('SELECTOR SUBSCRIPTION', affirmations.length);

    for (const affirmation of affirmations) {
      await this.scheduleNotification(new Affirmation(affirmation));
    }
  }

  cancelNotification(affirmation: AffirmationDto): Promise<void> {
    const schedule = new Affirmation(affirmation).cancelSchedule();

    if (schedule instanceof DailySchedule) {
      let lastCancel = new Promise<void>(() => {});
      for (const weekDay of schedule.scheduleDays) {
          lastCancel = LocalNotifications.cancel({
            notifications: [{
                id: schedule.generateNotificationId().toString()
              }]
          });
        }
      return lastCancel;
    } else if (schedule instanceof HourlySchedule) {
      return LocalNotifications.cancel({
        notifications: [{
          id: schedule.toString()
        }]
      });
    }

    return new Promise(() => {});
  }

  async scheduleNotification(affirmation: Affirmation): Promise<void> {
    await this.cancelNotification(affirmation);

    if (affirmation.scheduled && affirmation?.scheduleDto) {
      switch (affirmation.scheduleDto.scheduleType) {
        case ScheduleType.DAILY:
          this.scheduleDaily(affirmation);
          break;

        case ScheduleType.HOURLY:
          this.scheduleHourly(affirmation);
          break;

        default:
          throw new Error(`Unknown schedule type: ${affirmation.scheduleDto.scheduleType}`);
      }
    }
  }

  scheduleDaily(affirmation: Affirmation): void {
    const notifications = affirmation.schedule();

    for (const notification of notifications) {
      console.log('SCHEDULING DAILY FOR',
        notification.dateTime.toJSDate(),
        notification.id
      );

      LocalNotifications.schedule({
        notifications: [{
          title: affirmation.title,
          body: affirmation.text,
          id: notification.id,
          schedule: { at: notification.dateTime.toUTC().toJSDate(), every: notification.every, count: notification.count, repeats: true },
          sound: undefined,
          attachments: undefined,
          actionTypeId: '',
          extra: null
        }]
      }).then(() => console.log('SCHEDULED'));
    }
  }

  scheduleHourly(affirmation: Affirmation): void {
    const notification = affirmation.schedule()[0];

    console.log('SCHEDULING HOURLY FOR', notification.dateTime.toUTC().toJSDate(), notification.id);

    LocalNotifications.schedule({
      notifications: [{
        title: affirmation.title,
        body: affirmation.text,
        id: notification.id,
        schedule: { at: notification.dateTime.toJSDate(), every: notification.every, count: notification.count, repeats: true },
        sound: undefined,
        attachments: undefined,
        actionTypeId: '',
        extra: null
      }]
    }).then(() => console.log('SCHEDULED'));
  }
}
