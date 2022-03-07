import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgressBarService {


  progressBarActive$ = new Subject<boolean>();

  constructor() { }

  startSpinner(): void {
    this.progressBarActive$.next(true);
  }
  stopSpinner(): void {
    this.progressBarActive$.next(false);
  }

}
