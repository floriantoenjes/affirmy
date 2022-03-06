import {Injectable} from '@angular/core';
import {first} from 'rxjs/operators';
import {ScheduleDto, ScheduleType} from '../models/ScheduleDto';
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
    if (!schedule) {
      return new Promise(() => {});
    }
    if (schedule instanceof DailySchedule) {
      let lastCancel = new Promise<void>(() => {});
      for (const weekDay of schedule.scheduleDays) {
          lastCancel = LocalNotifications.cancel({
            notifications: [{
                id: `${this.generateNotificationId(schedule)}${schedule.getWeekdayNumber(weekDay)}`
              }]
          });
        }
      return lastCancel;
    }

    return LocalNotifications.cancel({
      notifications: [{
          id: this.generateNotificationId(schedule).toString()
        }]
    });
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
    if (!(affirmation.scheduleModel instanceof DailySchedule)) {
      return;
    }

    const scheduleModel = affirmation.scheduleModel;
    const scheduleDays = affirmation.schedule();

    for (const scheduleDate of scheduleDays) {
      console.log('SCHEDULING DAILY FOR',
        scheduleDate.toJSDate(),
        +`${this.generateNotificationId(scheduleModel)}${scheduleModel.getWeekdayNumber(scheduleDate.weekdayLong)}`
      );

      LocalNotifications.schedule({
        notifications: [{
          title: affirmation.title,
          body: affirmation.text,
          id: +`${this.generateNotificationId(scheduleModel)}${scheduleModel.getWeekdayNumber(scheduleDate.weekdayLong)}`,
          schedule: { at: scheduleDate.toUTC().toJSDate(), every: 'week', count: 1, repeats: true },
          sound: undefined,
          attachments: undefined,
          actionTypeId: '',
          extra: null
        }]
      }).then(() => console.log('SCHEDULED'));
    }
  }

  scheduleHourly(affirmation: Affirmation): void {
    if (!(affirmation.scheduleModel instanceof HourlySchedule)) {
      return;
    }

    const scheduleModel = affirmation.scheduleModel;
    const luxonTime = affirmation.schedule()[0];

    console.log('SCHEDULING HOURLY FOR', luxonTime.toUTC().toJSDate(), this.generateNotificationId(scheduleModel));

    LocalNotifications.schedule({
      notifications: [{
        title: affirmation.title,
        body: affirmation.text,
        id: this.generateNotificationId(scheduleModel),
        schedule: { at: luxonTime.toJSDate(), every: 'hour', count: scheduleModel.hourlyInterval, repeats: true },
        sound: undefined,
        attachments: undefined,
        actionTypeId: '',
        extra: null
      }]
    }).then(() => console.log('SCHEDULED'));
  }

  generateNotificationId(schedule: ScheduleDto): number {
    console.log('LN ID', new Date(schedule._id).getTime());
    return new Date(schedule._id).getTime();
  }

}
