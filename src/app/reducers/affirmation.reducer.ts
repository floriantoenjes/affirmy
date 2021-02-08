import {Action, createReducer, on} from '@ngrx/store';
import {createAffirmation, updateAffirmation, deleteAffirmation} from '../actions/affirmation.actions';
import {Affirmation} from '../shared/models/Affirmation';

export interface State {
  affirmations: Affirmation[];
}

export const initialState = {
  affirmations: [] as Affirmation[]
};

const affirmationReducer = createReducer(
  initialState,
  on(createAffirmation, (state, {affirmation}) => ({affirmations: [...state.affirmations, affirmation]}))
);


export function reducer(state: State | undefined, action: Action): State {
  return affirmationReducer(state, action);
}
