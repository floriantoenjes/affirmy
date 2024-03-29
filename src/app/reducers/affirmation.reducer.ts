import {Action, createFeatureSelector, createReducer, createSelector, on} from '@ngrx/store';
import {createAffirmation, deleteAffirmation, loadAffirmations, updateAffirmation} from '../actions/affirmation.actions';
import {Affirmation} from '../shared/models/Affirmation';
import {State} from './index';

export interface AffirmationState {
  affirmations: Affirmation[];
}

export const initialState = {
  affirmations: [
    // new Affirmation( 'Do the Dishes', 'Das Geschirr aufräumen'),
    // new Affirmation( 'Walk the Dog', 'Mit dem Hund rausgehen'),
    // new Affirmation( 'Rede nur', 'Ich rede nur, wenn ich auch etwas zu sagen habe.')
  ] as Affirmation[]
};

const affirmationReducer = createReducer(
  initialState,
  on(createAffirmation, (state, {affirmation}) => ({affirmations: [affirmation, ...state.affirmations]})),

  on(updateAffirmation, (state, {affirmation}) => (
    {affirmations: [affirmation, ...affirmationsWithoutOne(state, affirmation)]})),

  on(loadAffirmations, (state, {affirmations}) => {
    console.log('AFFIRMATIONS', affirmations);
    return ({affirmations: [...affirmations]});
  }),

  on(deleteAffirmation, (state, {affirmation}) => (
    {affirmations: [...affirmationsWithoutOne(state, affirmation)]})),
);

export function reducer(state: AffirmationState | undefined, action: Action): AffirmationState {
  return affirmationReducer(state, action);
}

function affirmationsWithoutOne(state: AffirmationState, affirmation: Affirmation): Affirmation[] {
  return state.affirmations.filter((af: Affirmation) => af._id !== affirmation._id);
}


export const getAffirmationsState = createFeatureSelector<State, AffirmationState>('affirmationsFeature');

export const getAffirmations = createSelector(getAffirmationsState, (affirmationState: AffirmationState) => {
  return affirmationState.affirmations.map(aff => {
    return aff;
  });
});

export const getAffirmationById = createSelector(
  getAffirmations,
  (affirmations: Affirmation[], props: any) => affirmations.find(af => af._id === props.id)
);

