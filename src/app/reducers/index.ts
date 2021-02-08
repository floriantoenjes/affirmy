import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromAffirmations from './affirmation.reducer';

console.log('FROM AFFIRM', fromAffirmations);

export interface State {
  affirmations2: fromAffirmations.State;
}

export const reducers: ActionReducerMap<State> = {
  affirmations2: fromAffirmations.reducer
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
