import {Action, createFeatureSelector, createReducer, createSelector, on} from '@ngrx/store';
import {createAffirmation, deleteAffirmation, loadAffirmations, updateAffirmation} from '../actions/affirmation.actions';
import {AffirmationDto} from '../shared/models/AffirmationDto';
import {State} from './index';

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
    return aff;
  });
});

export const getAffirmationById = createSelector(
  getAffirmations,
  (affirmations: AffirmationDto[], props: any) => affirmations.find(af => af._id === props.id)
);

