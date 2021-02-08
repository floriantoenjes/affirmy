import {ActionReducerMap, MetaReducer} from '@ngrx/store';
import {environment} from '../../environments/environment';
import * as fromAffirmations from './affirmation.reducer';

console.log('FROM AFFIRM', fromAffirmations);

export interface State {
  affirmationsFeature: fromAffirmations.AffirmationState;
}

export const reducers: ActionReducerMap<State> = {
  affirmationsFeature: fromAffirmations.reducer
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
