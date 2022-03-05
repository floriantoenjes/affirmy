import {createAction, props} from '@ngrx/store';
import {AffirmationDto} from '../shared/models/AffirmationDto';

export const fetchAffirmations = createAction('[Affirmation] Fetch');
export const loadAffirmations = createAction('[Affirmation] Load', props<{ affirmations: AffirmationDto[] }>());

export const startCreateAffirmation = createAction('[Affirmation] Start Creation', props<{affirmation: AffirmationDto}>());
export const createAffirmation = createAction('[Affirmation] Create', props<{ affirmation: AffirmationDto }>());

export const startUpdateAffirmation = createAction('[Affirmation] Start Update', props<{ affirmation: AffirmationDto }>());
export const updateAffirmation = createAction('[Affirmation] Update', props<{ affirmation: AffirmationDto }>());

export const deleteAffirmation = createAction('[Affirmation] Delete', props<{affirmation: AffirmationDto}>());
