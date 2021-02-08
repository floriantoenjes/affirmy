import {Action, createReducer, createSelector, on} from '@ngrx/store';
import {createAffirmation, updateAffirmation, deleteAffirmation} from '../actions/affirmation.actions';
import {Affirmation} from '../shared/models/Affirmation';

export interface State {
  affirmations: Affirmation[];
}

export const initialState = {
  affirmations: [
    new Affirmation(1, 'Do the Dishes', 'Das Geschirr aufräumen')
  ] as Affirmation[]
};

const affirmationReducer = createReducer(
  initialState,
  on(createAffirmation, (state, {affirmation}) => ({affirmations: [...state.affirmations, affirmation]}))
);


export function reducer(state: State | undefined, action: Action): State {
  return affirmationReducer(state, action);
}

export const getAffirmations = (state: State) => state.affirmations;

export const selectAffirmations = createSelector(getAffirmations, (affirmations) => affirmations);
