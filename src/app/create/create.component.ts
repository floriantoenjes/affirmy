import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {Store} from '@ngrx/store';
import {State} from '../reducers';
import {createAffirmation, updateAffirmation} from '../actions/affirmation.actions';
import {Affirmation} from '../shared/models/Affirmation';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  @Input()
  edit = false;

  @Input()
  affirmation: Affirmation | undefined;

  changed = false;

  form = new FormGroup({
    title: new FormControl(),
    text: new FormControl()
  });

  constructor(public router: Router, private store: Store<State>) { }

  ngOnInit(): void {
    if (this.affirmation) {
      this.form.patchValue(this.affirmation);
    }
  }

  createAffirmation(): void {
    if (this.form.valid) {
      const newAffirmation = new Affirmation(
        this.form.get('title')?.value,
        this.form.get('text')?.value
      );
      this.store.dispatch(createAffirmation({ affirmation: newAffirmation}));
      this.router.navigate(['detail', newAffirmation._id]);
    }
  }

  updateAffirmation(): void {
    if (this.form.valid) {
      const updatedAffirmation = {...this.affirmation, ...this.form.getRawValue()};
      this.store.dispatch(updateAffirmation({affirmation: updatedAffirmation}));
      this.router.navigate(['detail', this.affirmation?._id]);
    }
  }

  hasChanges(): void {
    if (this.form.get('title')?.value.trim() !== this.affirmation?.title
      || this.form.get('text')?.value.trim() !== this.affirmation?.text) {
      this.changed = true;
      console.log('CHANGED');
    } else {
      this.changed = false;
      console.log('NOT CHANGED');
    }
  }
}
