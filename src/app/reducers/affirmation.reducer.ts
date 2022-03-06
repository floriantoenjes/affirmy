import {Action, createFeatureSelector, createReducer, createSelector, on} from '@ngrx/store';
import {createAffirmation, deleteAffirmation, loadAffirmations, updateAffirmation} from '../actions/affirmation.actions';
import {AffirmationDto} from '../shared/models/AffirmationDto';
import {State} from './index';
import {Affirmation} from '../shared/models/Affirmation';
import {ScheduleType} from '../shared/models/ScheduleDto';
import {DailySchedule} from '../shared/models/DailySchedule';
import {HourlySchedule} from '../shared/models/HourlySchedule';

export interface AffirmationState {
  affirmations: AffirmationDto[];
}

export const initialState = {
  affirmations: [
    // new Affirmation( 'Do the Dishes', 'Das Geschirr aufräumen'),
    // new Affirmation( 'Walk the Dog', 'Mit dem Hund rausgehen'),
    // new Affirmation( 'Rede nur', 'Ich rede nur, wenn ich auch etwas zu sagen habe.')
  ] as AffirmationDto[]
};

const affirmationReducer = createReducer(
  initialState,
  on(createAffirmation, (state, {affirmation}) => ({affirmations: [affirmation, ...state.affirmations]})),

  on(updateAffirmation, (state, {affirmation}) => (
    {affirmations: [affirmation, ...state.affirmations.filter(af => af._id !== affirmation._id)]})),

  on(loadAffirmations, (state, {affirmations}) => {
    console.log('AFFIRMATIONS', affirmations);
    return ({affirmations: [...affirmations]});
  }),

  on(deleteAffirmation, (state, {affirmation}) => (
    {affirmations: [...state.affirmations.filter(af => af._id !== affirmation._id)]})),
);

export function reducer(state: AffirmationState | undefined, action: Action): AffirmationState {
  return affirmationReducer(state, action);
}


export const getAffirmationsState = createFeatureSelector<State, AffirmationState>('affirmationsFeature');

export const getAffirmations = createSelector(getAffirmationsState, (affirmationState: AffirmationState) => {
  return affirmationState.affirmations.map(aff => {
    let schedule = null;

    const affirmation = new Affirmation(aff);

    switch (aff.scheduleDto?.scheduleType) {
      case ScheduleType.DAILY:
        schedule = aff.scheduleDto as DailySchedule;
        schedule = new DailySchedule(schedule.affirmationId, schedule.scheduleTime, schedule.scheduleDays);
        affirmation.scheduleModel = schedule;
        break;
      case ScheduleType.HOURLY:
        schedule = aff.scheduleDto as HourlySchedule;
        schedule = new HourlySchedule(schedule.affirmationId, schedule.scheduleTime, schedule.hourlyInterval);
        affirmation.scheduleModel = schedule;
        break;
    }
    return affirmation;
  }) as Affirmation[];
});

export const getAffirmationById = createSelector(
  getAffirmations,
  (affirmations: Affirmation[], props: any) => affirmations.find(af => af._id === props.id) as Affirmation
);

