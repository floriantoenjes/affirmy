import {Schedule, ScheduleType} from '../shared/models/Schedule';
import {Action, createFeatureSelector, createReducer, createSelector, on} from '@ngrx/store';
import {createSchedule, updateSchedule} from '../actions/schedule.actions';
import {State} from './index';

export interface ScheduleState {
  schedules: Schedule[];
}

export const initialState = {
  schedules: [
    new Schedule('1', '1', true, ScheduleType.DAILY, [], '18:45')
  ] as Schedule[]
};

const scheduleReducer = createReducer(
  initialState,
  on(createSchedule, (state, {schedule}) => ({schedules: [...state.schedules, schedule]})),
  on(updateSchedule, (state, {schedule}) => ({
    schedules: [...state.schedules.filter(s => s.id !== schedule.id), schedule]
  }))
);

export function reducer(state: ScheduleState | undefined, action: Action): ScheduleState {
  return scheduleReducer(state, action);
}

export const getSchedulesState = createFeatureSelector<State, ScheduleState>('schedulesFeature');

export const getSchedules = createSelector(getSchedulesState, (scheduleState: ScheduleState) => {
  return scheduleState.schedules;
});

export const getScheduleById = createSelector(
  getSchedules,
  (schedules: Schedule[], props: any) => schedules.find(sc => sc.affirmationId === props.id)
);
