import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage: string;

        if (error.status === 401) {
          // Handle Unauthorized errors (e.g., redirect to login)
          errorMessage = 'Unauthorized. Please log in again.';
          this.router.navigate(['/login']); // Redirect to login page
        } else if (error.status === 404) {
          // Handle Not Found errors
          errorMessage = 'Resource not found';
        } else if (error.status === 500) {
          // Handle Server errors
          errorMessage = 'Internal server error. Please try again later.';
        } else {
          // Handle other error status codes
          errorMessage = `Error: ${error.message}`;
        }

        console.error('HTTP Error: ', errorMessage);

        // Return an observable with a user-facing error message
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
