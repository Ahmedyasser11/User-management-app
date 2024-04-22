import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, delay, filter, map, retry, retryWhen, switchMap, take, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  
  
  constructor( private _rout: Router) {
    
    
   }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem("token");
    debugger;
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return next.handle(request).pipe(
      catchError((error: any, caught: Observable<HttpEvent<any>>) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          
          this._rout.navigate(['/']);
        }
        return throwError(error);
      }),
      retry({ count: 0 })
    );
    }
 
}