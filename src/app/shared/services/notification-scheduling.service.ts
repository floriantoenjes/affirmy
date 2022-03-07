import {Injectable} from '@angular/core';
import {first} from 'rxjs/operators';
import {Plugins} from '@capacitor/core';
import {Store} from '@ngrx/store';
import {State} from '../../reducers';
import {getAffirmations} from '../../reducers/affirmation.reducer';
import {AffirmationDto} from '../models/AffirmationDto';
import {Affirmation} from '../models/Affirmation';

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
      await this.cancelNotification(affirmation);
      if (affirmation.scheduled) {
        await this.schedule(new Affirmation(affirmation));
      }
    }
  }

  cancelNotification(affirmation: AffirmationDto): Promise<void> {
    console.log('CANCELING');
    if (!affirmation.scheduled) {
      return new Promise((resolve => resolve()));
    }

    const schedule = new Affirmation(affirmation).cancelSchedule();

    if (schedule) {
      let lastCancel = new Promise<void>((resolve) => resolve());
      for (const notification of affirmation.notifications) {
        lastCancel = LocalNotifications.cancel({
          notifications: [{
            id: notification.id.toString()
          }]
        });
      }
      return lastCancel;
    }

    return new Promise((resolve) => resolve());
  }

  schedule(affirmation: Affirmation): void {
    const notifications = affirmation.schedule();

    for (const notification of notifications) {
      console.log(`SCHEDULING ${notification.every}ly FOR`,
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
}
