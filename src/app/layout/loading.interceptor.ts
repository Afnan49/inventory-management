import { HttpInterceptorFn } from '@angular/common/http';
import { BusyService } from './busy.service';
import { inject } from '@angular/core';
import { delay, finalize } from 'rxjs/operators';
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyService);
  busyService.busy();
  return next(req).pipe(
    delay(1000),
    finalize(() => {
      busyService.idle();
    })
  );
};
