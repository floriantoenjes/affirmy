import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {Store} from '@ngrx/store';
import {State} from '../reducers';
import {createAffirmation} from '../actions/affirmation.actions';
import {Affirmation} from '../shared/models/Affirmation';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  form = new FormGroup({
    title: new FormControl(),
    text: new FormControl()
  });

  constructor(public router: Router, private store: Store<State>) { }

  ngOnInit(): void {
  }

  createAffirmation(): void {
    if (this.form.valid) {
      const newAffirmation = new Affirmation(
        10,
        this.form.get('title')?.value,
        this.form.get('text')?.value
      );
      this.store.dispatch(createAffirmation({ affirmation: newAffirmation}));
      this.router.navigate(['detail', '10']);
    }
  }
}
