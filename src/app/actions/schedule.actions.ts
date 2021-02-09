import {createAction, props} from '@ngrx/store';
import {Schedule} from '../shared/models/Schedule';

export const createSchedule = createAction('[Schedule] Create', props<{ schedule: Schedule; }>());
export const deleteSchedule = createAction('[Schedule] Delete', props<{ scheduleId: number }>());
