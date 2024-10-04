import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${endpoint}`).pipe(
        catchError(this.handleError)
    );
  }

  post<T>(endpoint: string, payload: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, payload).pipe(
        catchError(this.handleError)
    );
  }

  // Centralized error handling method
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage: string;

    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Backend or server-side error
      errorMessage = `Server error: ${error.status} - ${error.message}`;
    }

    console.error('API Error: ', errorMessage);
    
    // Display user-friendly error message or log
    return throwError(() => new Error(errorMessage));
  }
}
