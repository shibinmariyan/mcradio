import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, retry } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GlobalInterceptorService implements HttpInterceptor, CanActivate {

  constructor(private router: Router, private auth: AuthService) {
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let currentReq = req;
    if (this.auth.isAuthorized) {
      let token = this.auth.getToken();
      currentReq = req.clone({
        setHeaders: {
          "Authorization": "Bearer " + token,
        },
      });
    }
    else
      console.log("Global report Failed");
    return next.handle(currentReq)
      .pipe(
        tap((ev: HttpEvent<any>) => {
          if (ev instanceof HttpResponse) {
            if (ev.body && ev.body.error === 9999) {
              this.router.navigate([""]);
            }
          }
        }),
        retry(1),
        catchError((error: HttpErrorResponse) => {
          let errMsg = "";
          if (error.error instanceof ErrorEvent) {
            // client-side error
            errMsg = `Error: ${error.error.message}`;
          } else {
            // server-side error
            errMsg = `Error Status: ${error.status}\nMessage: ${error.message}`;
          }
          console.log(error)
          alert(error.statusText);
          location.reload();
          return throwError(errMsg);
        })
      )
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.auth.isAuthorized())
      return true
    else {
      this.router.navigate(['login']);
      return false;
    }
  }
}

