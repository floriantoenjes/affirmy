import {createAction, props} from '@ngrx/store';
import {Affirmation} from '../shared/models/Affirmation';

export const fetchAffirmations = createAction('[Affirmation] Fetch');
export const loadAffirmations = createAction('[Affirmation] Load', props<{ affirmations: Affirmation[] }>());

export const createAffirmation = createAction('[Affirmation] Create', props<{ affirmation: Affirmation }>());
export const updateAffirmation = createAction('[Affirmation] Update', props<{ affirmation: Affirmation }>());
export const deleteAffirmation = createAction('[Affirmation] Delete', props<{affirmation: Affirmation}>());
