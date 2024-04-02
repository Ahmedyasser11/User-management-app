import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(private http: HttpClient) { }

  authenticate(email: string, password: string): Observable<{ authenticated: boolean, isAdmin: boolean }> {
    return this.http.get<any[]>('http://localhost:3000/user').pipe(
      map(users => {
        const user = users.find(u => u.email === email && u.passwoord === password);
        if (user) {
          return { authenticated: true, isAdmin: user.role.includes('Admin') };
        } else {
          return { authenticated: false, isAdmin: false };
        }
      })
    );
  }
}

