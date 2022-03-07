import {Schedule} from './Schedule';
import {Affirmation} from './Affirmation';
import {Notification} from './Notification';
import {ScheduleClasses} from './ScheduleClasses';

export class AffirmationService {

  schedule(affirmationDto: Affirmation, scheduleDto?: Schedule): Notification[] {
    affirmationDto = {...affirmationDto, scheduled: true};
    if (affirmationDto.scheduleDto && !scheduleDto) {
      return new ScheduleClasses[affirmationDto.scheduleDto.scheduleType]().schedule(affirmationDto.scheduleDto);
    } else if (scheduleDto) {
      affirmationDto.scheduleDto = scheduleDto;

      const notifications = new ScheduleClasses[affirmationDto.scheduleDto.scheduleType]().schedule(scheduleDto);
      affirmationDto.notifications = notifications;

      return notifications;
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
