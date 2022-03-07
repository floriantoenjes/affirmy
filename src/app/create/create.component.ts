import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {Store} from '@ngrx/store';
import {State} from '../reducers';
import {startCreateAffirmation, startUpdateAffirmation} from '../actions/affirmation.actions';
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

  @Input()
  title = 'Create';

  form = new FormGroup({
    title: new FormControl(),
    text: new FormControl()
  });

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private store: Store<State>
  ) { }

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
      this.store.dispatch(startCreateAffirmation({ affirmation: newAffirmation}));
      this.router.navigate(['detail', newAffirmation._id]); // TODO: Navigate later
    }
  }

  updateAffirmation(): void {
    if (this.form.valid) {
      const updatedAffirmation = {...this.affirmation, ...this.form.getRawValue()};
      this.store.dispatch(startUpdateAffirmation({affirmation: updatedAffirmation}));
      this.router.navigate(['detail', this.affirmation?._id]);
    }
  }

  hasChanges(): void {
    const titleValue = this.form.get('title')?.value?.trim();
    const textValue = this.form.get('text')?.value?.trim();

    const titleValueInvalid = titleValue === '' || titleValue === undefined;
    const textValueInvalid = textValue === '' || textValue === undefined;

    if (!this.edit) {
      if ( titleValueInvalid || textValueInvalid ) {
        this.changed = false;
        return;
      }
    }

    if ((!titleValueInvalid && !textValueInvalid) && titleValue !== this.affirmation?.title || textValue !== this.affirmation?.text) {
      this.changed = true;
    } else {
      this.changed = false;
    }
  }

  navigateBack(): void {
    this.router.navigate(['..'], {relativeTo: this.route});
  }
}
