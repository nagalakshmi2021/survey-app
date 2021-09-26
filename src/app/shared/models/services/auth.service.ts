import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../user.model';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  endpoint: string = 'http://localhost:4000/api';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};

  constructor(
    private http: HttpClient,
    public router: Router
  ) {
  }

  // Sign-up
  signUp(user: User): Observable<any> {
    let api = `${this.endpoint}/register-user`;
    return this.http.post(api, user)
      .pipe(
        catchError(this.handleError)
      )
  }

  // Sign-in
  signIn(user: User): boolean {

    // get password from local storage. 
    const password = localStorage.getItem('password');
    if (password) {
      return user.email === 'admin@gmail.com' && user.password === password;
    } else {
      return user.email === 'admin@gmail.com' && user.password === 'Admin@123';
    }
    // return this.http.post<any>(`${this.endpoint}/signin`, user)
    //   .subscribe((res: any) => {
    //     localStorage.setItem('access_token', res.token)
    //     this.getUserProfile(res._id).subscribe((res) => {
    //       this.currentUser = res;
    //       this.router.navigate(['user-profile/' + res.msg._id]);
    //     })
    //   })
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('access_token');
    return (authToken !== null) ? true : false;
  }

  doLogout() {
    let removeToken = localStorage.removeItem('access_token');
    if (removeToken == null) {
      this.router.navigate(['log-in']);
    }
  }

  // User profile
  //   getUserProfile(id:string): Observable<any> {
  //     let api = `${this.endpoint}/user-profile/${id}`;
  //     return this.http.get(api, { headers: this.headers }).pipe(
  //       map((res: Response) => {
  //         return res || {}
  //       }),
  //       catchError(this.handleError)
  //     )
  //   }

  // Error 
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }
}