import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  role: any;

  constructor(private _http: HttpClient,private _rout: Router) { }
  private baseUrl = 'https://localhost:7107/User/';
  private baseUrl1 = 'https://localhost:7107/User/AddRoleToUser';
  addRole(userId: string, x: string) {
    return this._http.post(`${this.baseUrl1}?userId=${userId}&roleName=${x}`,x);
  }
 

  
  addUser(dataa: any): Observable<any>{
    
    return this._http.post('https://localhost:7107/User/AddUser',dataa);
  }
  getuser():Observable<any>{
    return this._http.get('http://localhost:3000/user');
  }
  updateUSer(userId: string, dataa: any): Observable<any> {
    return this._http.put(`${this.baseUrl}?id=${userId}`,dataa);
  }
  deleteUser(userId: string): Observable<any> {
    return this._http.delete(`${this.baseUrl}?id=${userId}`);
  }
  login(username: string, password: string): Observable<any> {
    const body = {
      Username: username,
      pass: password
    };
    const helper = new JwtHelperService();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this._http.post<any>('https://localhost:7107/Login', body, { headers: headers }).pipe(
      map(response => {
        
        if (response.statusCode === 200) {
          
          localStorage.setItem('token', response.data.token);
          var claims = helper.decodeToken(response.data.token);
          this.role.next(claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);
          if (this.role.value=="Admin"){
            this._rout.navigate(['/Home']);
          }
          else{
            this._rout.navigate(['/userPage']);
          }
        } else {
          console.log('Invalid Username Or Password');
        }
        return response;
      }),
      catchError(error => {
        console.error('Error occurred:', error);
        return throwError('Something went wrong with the login.');
      })
    );
  }
}
