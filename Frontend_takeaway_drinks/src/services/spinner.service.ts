import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private spinnerSubject = new BehaviorSubject<boolean>(false);
  spinner$ = this.spinnerSubject.asObservable();

  showSpinner() {
    this.spinnerSubject.next(true);
    console.log('Showing spinner');
  }

  hideSpinner() {
      this.spinnerSubject.next(false);
      console.log('Hiding spinner');
  }
}