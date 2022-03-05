import {Injectable} from '@angular/core';
import {take} from 'rxjs/operators';
import {ScheduleDto, ScheduleType} from '../models/ScheduleDto';
import {Plugins} from '@capacitor/core';
import {Store} from '@ngrx/store';
import {State} from '../../reducers';
import {getAffirmationById, getAffirmations} from '../../reducers/affirmation.reducer';
import {AffirmationDto} from '../models/AffirmationDto';
import {Affirmation} from '../models/Affirmation';
import {DailySchedule} from '../models/DailySchedule';
import {HourlySchedule} from '../models/HourlySchedule';
import {Schedule} from '../models/Schedule';

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

    this.store.select(getAffirmations).pipe(take(1)).subscribe(
      affirmations => {
        console.log('SELECTOR SUBSCRIPTION', affirmations.length);

        for (const affirmation of affirmations) {
          this.scheduleNotification(new Affirmation(affirmation));
        }
      }
    );
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
            notifications: [
              {
                id: `${this.generateNotificationId(schedule)}${schedule.getWeekdayNumber(weekDay)}`
              }
            ]
          });
        }
      return lastCancel;
    }

    return LocalNotifications.cancel({
      notifications: [
        {
          id: this.generateNotificationId(schedule).toString()
        }
      ]
    });
  }

  scheduleNotification(affirmation: Affirmation): void {
        this.cancelNotification(affirmation).then(() => {
          if (affirmation.scheduled) {
            this.store.select(getAffirmationById, {id: affirmation._id}).pipe(take(1)).subscribe(
              (aff) => {
                if (!aff?.scheduleModel) {
                  return;
                }

                switch (aff.scheduleModel.scheduleType) {
                  case ScheduleType.DAILY:
                    this.scheduleDaily(affirmation);
                    break;

                  case ScheduleType.HOURLY:
                    this.scheduleHourly(affirmation);
                    break;

                  default:
                    throw new Error(`Unknown schedule type: ${aff.scheduleModel.scheduleType}`);
                }
              }
            );
          }
        });
  }

  scheduleDaily(affirmation: Affirmation): void {
    if (!affirmation.scheduleModel) {
      return;
    }

    const scheduleModel = new Schedule(affirmation.scheduleModel) as DailySchedule;
    const scheduleDays = affirmation.scheduleDaily();

    console.log(scheduleModel.getWeekdayNumber('Monday'));

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
    if (!affirmation.scheduleModel) {
      return;
    }

    const scheduleModel = affirmation.scheduleModel as HourlySchedule;

    const luxonTime = affirmation.scheduleHourly()[0];

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
