import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Affirmation} from '../shared/models/Affirmation';
import {Observable, of} from 'rxjs';
import {Store} from '@ngrx/store';
import {State} from '../reducers';
import {getAffirmationById} from '../reducers/affirmation.reducer';
import {deleteAffirmation, startUpdateAffirmation} from '../actions/affirmation.actions';
import {Schedule} from '../shared/models/Schedule';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../dialogs/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  affirmation$: Observable<Affirmation | undefined>;
  schedule$: Observable<Schedule | undefined>;

  constructor(private route: ActivatedRoute, private dialog: MatDialog, public router: Router, private store: Store<State>) {
    this.affirmation$ = this.getCurrentAffirmation();
    this.schedule$ = of();
  }

  ngOnInit(): void {
  }

  private getCurrentAffirmation(): Observable<Affirmation | undefined> {
    return this.store.select(getAffirmationById, {id: this.route.snapshot.paramMap.get('id')});
  }

  navigateToEdit(): void {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  navigateToSchedule(): void {
    this.router.navigate(['schedule'], {relativeTo: this.route});
  }

  delete(affirmation: Affirmation): void {
    this.dialog.open(ConfirmDialogComponent, {width: '300px'}).afterClosed().subscribe(result => {
      if (result === true) {
        this.store.dispatch(deleteAffirmation({affirmation}));

        this.router.navigate(['..']);
      }
    });
  }

  changeActive($event: MatSlideToggleChange, affirmation: Affirmation): void {
    affirmation = {...affirmation, scheduled: $event.checked};
    this.store.dispatch(startUpdateAffirmation({affirmation}));
  }
}
