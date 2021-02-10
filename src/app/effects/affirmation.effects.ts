import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import * as AffirmationActions from '../actions/affirmation.actions';
import {map, mergeMap} from 'rxjs/operators';
import {from} from 'rxjs';
import {create} from 'domain';

@Injectable()
export class AffirmationEffects {

  db = new PouchDB('affirmations2');

  $fetchAffirmations = createEffect(() => this.actions$.pipe(
    ofType(AffirmationActions.fetchAffirmations),
    mergeMap(() => {
      console.log('fetching');
      return from(this.db.allDocs({
        include_docs: true, descending: true
      }));
    }),
    map(docs => {
      console.log('RESULTS', docs);
      const affirmations = docs.rows.map(row => row.doc);
      console.log('AFFS', affirmations);
      return ({type: '[Affirmation] Load', affirmations});
    })
  ));

  $createAffirmation = createEffect(() => this.actions$.pipe(
    ofType(AffirmationActions.createAffirmation),
    map(action => {
      this.db.put(action.affirmation);
    })
  ), {dispatch: false});


  constructor(
    private actions$: Actions
  ) {
  }
}
