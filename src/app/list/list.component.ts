import {Component, OnDestroy, OnInit} from '@angular/core';
import {Affirmation} from '../shared/models/Affirmation';
import {Store} from '@ngrx/store';
import {State} from '../reducers';
import {getAffirmations} from '../reducers/affirmation.reducer';
import {Router} from '@angular/router';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

  affirmations!: Affirmation[];

  private dragging = false;

  private untilDestroy = new Subject<boolean>();

  constructor(public router: Router, store: Store<State>) {
    store.select(getAffirmations)
      .pipe(takeUntil(this.untilDestroy))
      .subscribe(affirmations => this.affirmations = affirmations);
  }

  ngOnInit(): void {
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.affirmations, event.previousIndex, event.currentIndex);
  }

  dragStarted(): void {
    this.dragging = true;
  }

  openAffirmation(affirmation: Affirmation): void {
    if (!this.dragging) {
      this.router.navigate(['detail', affirmation._id]);
    } else {
      this.dragging = false;
    }
  }

  ngOnDestroy(): void {
    this.untilDestroy.next(true);
  }
}
