import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import * as AffirmationActions from '../actions/affirmation.actions';
import {map, mergeMap, tap} from 'rxjs/operators';
import {from} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable()
export class AffirmationEffects {

  db = new PouchDB('affirmations2');
  actionPipe$ = this.actions$.pipe(tap(() => this.db.sync(environment.pouchDbAffirmations)));

  $fetchAffirmations = createEffect(() => this.actionPipe$.pipe(
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

  $createAffirmation = createEffect(() => this.actionPipe$.pipe(
    ofType(AffirmationActions.createAffirmation),
    map(action => {
      this.db.put({...action.affirmation});
    })
  ), {dispatch: false});

  $updateAffirmation = createEffect(() => this.actionPipe$.pipe(
    ofType(AffirmationActions.updateAffirmation),
    map(action => this.db.put(action.affirmation))
  ), {dispatch: false});

  $deleteAffirmation = createEffect(() => this.actionPipe$.pipe(
    ofType(AffirmationActions.deleteAffirmation),
    map(action => {
      this.db.remove(action.affirmation);
    })
  ), {dispatch: false});

  constructor(
    private actions$: Actions
  ) {
  }
}
