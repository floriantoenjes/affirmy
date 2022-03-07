import {Schedule} from './Schedule';
import {Affirmation} from './Affirmation';
import {Notification} from './Notification';
import {ScheduleClasses} from './ScheduleClasses';
import {Injectable, Injector} from '@angular/core';

@Injectable({providedIn: 'root'})
export class AffirmationService {

  constructor(private injector: Injector) {}


  schedule(affirmationDto: Affirmation, scheduleDto?: Schedule): [Affirmation, Notification[]] {

    affirmationDto = {...affirmationDto, scheduled: true};
    if (affirmationDto.scheduleDto && !scheduleDto) {
      return [affirmationDto,
        this.injector.get(ScheduleClasses[affirmationDto.scheduleDto.scheduleType]).schedule(affirmationDto.scheduleDto)];
    } else if (scheduleDto) {
      affirmationDto.scheduleDto = scheduleDto;

      const notifications =
        this.injector.get(ScheduleClasses[affirmationDto.scheduleDto.scheduleType]).schedule(scheduleDto);
      affirmationDto.notifications = notifications;

      return [affirmationDto, notifications];
    }
    throw new Error('A schedule model needs to be present!');
  }

  cancelSchedule(affirmationDto: Affirmation): Schedule | void {
    affirmationDto = {...affirmationDto, scheduled: false};

    if (affirmationDto.scheduleDto) {
      return affirmationDto.scheduleDto;
    }
  }

}
