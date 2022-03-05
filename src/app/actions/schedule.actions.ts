import {createAction, props} from '@ngrx/store';
import {ScheduleDto} from '../shared/models/ScheduleDto';

export const fetchSchedules = createAction('[Schedule] Fetch');
export const loadSchedules = createAction('[Schedule] Load', props<{schedules: ScheduleDto[]}>());

export const startCreateSchedule = createAction('[Schedule] Start Creation', props<{schedule: ScheduleDto}>());
export const createSchedule = createAction('[Schedule] Create', props<{ schedule: ScheduleDto; }>());

export const startUpdateSchedule = createAction('[Schedule] Start Update', props<{ schedule: ScheduleDto; }>());
export const updateSchedule = createAction('[Schedule] Update', props<{ schedule: ScheduleDto; }>());

export const startDeleteSchedule = createAction('[Schedule] Start Deletion', props<{ schedule: ScheduleDto }>());
export const deleteSchedule = createAction('[Schedule] Delete', props<{ schedule: ScheduleDto }>());
