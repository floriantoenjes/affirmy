import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromAffirmations from './affirmation.reducer';

export interface State {
  affirmations: fromAffirmations.State;
}

export const reducers: ActionReducerMap<State> = {
  affirmations: fromAffirmations.reducer
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
