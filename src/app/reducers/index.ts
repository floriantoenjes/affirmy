import {ActionReducerMap, MetaReducer} from '@ngrx/store';
import {environment} from '../../environments/environment';
import * as fromAffirmations from './affirmation.reducer';
import * as fromSchedules from './schedule.reducer';

console.log('FROM AFFIRM', fromAffirmations);

export interface State {
  affirmationsFeature: fromAffirmations.AffirmationState;
  schedulesFeature: fromSchedules.ScheduleState;
}

export const reducers: ActionReducerMap<State> = {
  affirmationsFeature: fromAffirmations.reducer,
  schedulesFeature: fromSchedules.reducer,
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
