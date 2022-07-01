import {Injectable} from '@angular/core';
import {first} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {State} from '../../../reducers';
import {getAffirmations} from '../../../reducers/affirmation.reducer';
import {Affirmation} from '../../models/Affirmation';
import {AffirmationService} from '../domain/AffirmationService';
import {LocalNotifications} from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root'
})
export class NotificationSchedulingService {

  constructor(private store: Store<State>, private affirmationService: AffirmationService) { }

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

    const affirmationDtos = await this.store.select(getAffirmations).pipe(first()).toPromise();
    console.log('SELECTOR SUBSCRIPTION', affirmationDtos.length);

    for (const affirmation of affirmationDtos) {
      await this.cancelNotification(affirmation);
      if (affirmation.scheduled) {
        await this.schedule(affirmation);
      }
    }
  }

  cancelNotification(affirmationDto: Affirmation): Promise<void> {
    console.log('CANCELING');

    const schedule = this.affirmationService.cancelSchedule(affirmationDto);

    if (schedule) {
      let lastCancel = new Promise<void>((resolve) => resolve());
      for (const notification of affirmationDto.notifications) {
        lastCancel = LocalNotifications.cancel({
          notifications: [{
            id: notification.id
          }]
        });
      }
      return lastCancel;
    }

    return new Promise((resolve) => resolve());
  }

  schedule(affirmationDto: Affirmation): void {
    const notifications = this.affirmationService.schedule(affirmationDto)[1];

    for (const notification of notifications) {
      console.log(`SCHEDULING ${notification.every}ly FOR`,
        notification.dateTime.toJSDate(),
        notification.id
      );

      LocalNotifications.schedule({
        notifications: [{
          title: affirmationDto.title,
          body: affirmationDto.text,
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
