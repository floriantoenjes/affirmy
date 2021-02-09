import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import * as AffirmationActions from '../actions/affirmation.actions';
import {map} from 'rxjs/operators';

@Injectable()
export class AffirmationEffects {

  $fetchAffirmations = createEffect(() => this.actions$.pipe(
    ofType(AffirmationActions.fetchAffirmations),
    map(() => ({type: '[Affirmation] Load', payload: []}))
  ));


  constructor(
    private actions$: Actions
  ) {
  }
}
