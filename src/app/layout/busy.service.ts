import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
@Injectable({
  providedIn: 'root',
})
export class BusyService {
  private busyRequestCount = 0;
  constructor(private spinner: NgxSpinnerService) {}

  busy() {
    this.busyRequestCount++;
    this.spinner;
    this.spinner.show(undefined, {
      type: 'ball-scale-ripple',
      bdColor: 'rgba(0,0,0,0.8)',
      color: '#fff',
      size: 'default',
    });
  }

  idle() {
    this.busyRequestCount--;
    if (this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;
      this.spinner.hide();
    }
  }
}
