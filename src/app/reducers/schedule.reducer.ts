import {Schedule} from '../shared/models/Schedule';
import {Action, createFeatureSelector, createReducer, createSelector, on} from '@ngrx/store';
import {createSchedule, deleteSchedule, loadSchedules, updateSchedule} from '../actions/schedule.actions';
import {State} from './index';

export interface ScheduleState {
  schedules: Schedule[];
}

export const initialState = {
  schedules: [
    // new Schedule('1', true, ScheduleType.DAILY, [], '18:45')
  ] as Schedule[]
};

const scheduleReducer = createReducer(
  initialState,
  on(createSchedule, (state, {schedule}) => ({schedules: [...state.schedules, schedule]})),

  on(updateSchedule, (state, {schedule}) => ({
    schedules: [...schedulesWithoutOne(state, schedule), schedule],
  })),

  on(loadSchedules, (state, {schedules}) => {
    return ({schedules});
  }),

  on(deleteSchedule, (state, {schedule}) => ({
    schedules: schedulesWithoutOne(state, schedule),
  }))
);

export function reducer(state: ScheduleState | undefined, action: Action): ScheduleState {
  return scheduleReducer(state, action);
}

function schedulesWithoutOne(state: ScheduleState, schedule: Schedule): Schedule[] {
  return state.schedules.filter(s => s._id !== schedule._id);
}

export const getSchedulesState = createFeatureSelector<State, ScheduleState>('schedulesFeature');

export const getSchedules = createSelector(getSchedulesState, (scheduleState: ScheduleState) => {
  return scheduleState.schedules;
});
