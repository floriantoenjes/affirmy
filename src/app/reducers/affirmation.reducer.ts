import {Action, createFeatureSelector, createReducer, createSelector, on, Props} from '@ngrx/store';
import {createAffirmation, loadAffirmations, updateAffirmation} from '../actions/affirmation.actions';
import {Affirmation} from '../shared/models/Affirmation';
import {State} from './index';

export interface AffirmationState {
  affirmations: Affirmation[];
}

export const initialState = {
  affirmations: [
    new Affirmation( 'Do the Dishes', 'Das Geschirr aufräumen'),
    new Affirmation( 'Walk the Dog', 'Mit dem Hund rausgehen'),
    new Affirmation( 'Rede nur', 'Ich rede nur, wenn ich auch etwas zu sagen habe.')
  ] as Affirmation[]
};

const affirmationReducer = createReducer(
  initialState,
  on(createAffirmation, (state, {affirmation}) => ({affirmations: [...state.affirmations, affirmation]})),

  on(updateAffirmation, (state, {affirmation}) => (
    {affirmations: [...state.affirmations.filter(af => af._id !== affirmation._id), affirmation]})),

  on(loadAffirmations, (state, {affirmations}) => {
    console.log('AFFIRMATIONS', affirmations);
    return ({affirmations: [...affirmations]});
  })
);

export function reducer(state: AffirmationState | undefined, action: Action): AffirmationState {
  return affirmationReducer(state, action);
}


export const getAffirmationsState = createFeatureSelector<State, AffirmationState>('affirmationsFeature');

export const getAffirmations = createSelector(getAffirmationsState, (affirmationState: AffirmationState) => {
  return affirmationState.affirmations;
});

export const getAffirmationById = createSelector(
  getAffirmations,
  (affirmations: Affirmation[], props: any) => affirmations.find(af => af._id === props.id)
);

