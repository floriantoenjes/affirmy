import {createAction, props} from '@ngrx/store';
import {Schedule} from '../shared/models/Schedule';

export const fetchSchedules = createAction('[Schedule] Fetch');
export const loadSchedules = createAction('[Schedule] Load', props<{schedules: Schedule[]}>());

export const startCreateSchedule = createAction('[Schedule] Start Creation', props<{schedule: Schedule}>());
export const createSchedule = createAction('[Schedule] Create', props<{ schedule: Schedule; }>());

export const startUpdateSchedule = createAction('[Schedule] Start Update', props<{ schedule: Schedule; }>());
export const updateSchedule = createAction('[Schedule] Update', props<{ schedule: Schedule; }>());

export const startDeleteSchedule = createAction('[Schedule] Start Deletion', props<{ schedule: Schedule }>());
export const deleteSchedule = createAction('[Schedule] Delete', props<{ schedule: Schedule }>());
