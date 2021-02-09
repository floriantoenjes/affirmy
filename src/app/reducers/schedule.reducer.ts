import {Schedule} from '../shared/models/Schedule';
import {Action, createReducer, on} from '@ngrx/store';
import {createSchedule} from '../actions/schedule.actions';

export interface ScheduleState {
  schedules: Schedule[];
}

export const initialState = {
  schedules: [] as Schedule[]
};

const scheduleReducer = createReducer(
  initialState,
  on(createSchedule, (state, {schedule}) => ({schedules: [...state.schedules, schedule]}))
);

export function reducer(state: ScheduleState | undefined, action: Action): ScheduleState {
  return scheduleReducer(state, action);
}
