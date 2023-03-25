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
  affirmation?: Affirmation;

  changed = false;

  @Input()
  title = 'Create';

  form = new FormGroup({
    title: new FormControl(),
    text: new FormControl()
  });


  get titleValue(): string {
    return this.form.get('title')?.value;
  }

  get textValue(): string {
    return this.form.get('text')?.value;
  }

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private store: Store<State>
  ) {
  }

  ngOnInit(): void {
    if (this.affirmation) {
      this.form.patchValue(this.affirmation);
    }
  }

  createAffirmation(): void {
    if (this.form.valid) {
      const newAffirmation = new Affirmation(
        this.titleValue,
        this.textValue
      );
      this.store.dispatch(startCreateAffirmation({affirmation: newAffirmation}));

      this.router.navigate(['detail', newAffirmation._id]).then(); // TODO: Navigate later
    }
  }

  updateAffirmation(): void {
    if (this.form.valid) {
      const updatedAffirmation = {...this.affirmation, ...this.form.getRawValue()};
      this.store.dispatch(startUpdateAffirmation({affirmation: updatedAffirmation}));

      this.router.navigate(['detail', this.affirmation?._id]).then();
    }
  }

  hasChanges(): void {
    const titleValue = this.titleValue?.trim();
    const textValue = this.textValue?.trim();

    const titleValueInvalid = titleValue === '' || titleValue === undefined;
    const textValueInvalid = textValue === '' || textValue === undefined;

    if (titleValueInvalid || textValueInvalid) {
      this.changed = false;
      return;
    }

    this.changed = this.titleOrTextHaveChanges(titleValue, textValue);
  }

  private titleOrTextHaveChanges(titleValue: string, textValue: string): boolean {
    return titleValue !== this.affirmation?.title || textValue !== this.affirmation?.text;
  }

  navigateBack(): void {
    this.router.navigate(['..'], {relativeTo: this.route}).then();
  }
}
