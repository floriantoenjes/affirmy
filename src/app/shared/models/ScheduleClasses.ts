import {DailyScheduleService} from '../services/domain/DailyScheduleService';
import {HourlyScheduleService} from '../services/domain/HourlyScheduleService';

export const ScheduleClasses = {
  0: DailyScheduleService,
  1: HourlyScheduleService,
};
