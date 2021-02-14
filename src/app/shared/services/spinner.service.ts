import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  spinnerActive$ = new Subject<boolean>();

  constructor() { }

  startSpinner(): void {
    this.spinnerActive$.next(true);
  }
  stopSpinner(): void {
    this.spinnerActive$.next(false);
  }
}
