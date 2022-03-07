import {ScheduleDto} from './ScheduleDto';
import {AffirmationDto} from './AffirmationDto';
import {Notification} from './Notification';
import {ScheduleClasses} from './ScheduleClasses';

export class Affirmation {

  schedule(affirmationDto: AffirmationDto, scheduleDto?: ScheduleDto): Notification[] {
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

  cancelSchedule(affirmationDto: AffirmationDto): ScheduleDto | void {
    affirmationDto = {...affirmationDto, scheduled: false};

    if (affirmationDto.scheduleDto) {
      return affirmationDto.scheduleDto;
    }
  }

}
