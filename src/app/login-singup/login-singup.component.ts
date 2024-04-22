import { Component } from '@angular/core';
import { FormBuilder , FormGroup } from '@angular/forms';
import { AuthServiceService } from '../auth-service.service';
import { Router } from '@angular/router';
import { AddUpdateUserComponent } from '../add-update-user/add-update-user.component';
import { MatDialog } from '@angular/material/dialog';
import { SignupComponent } from '../signup/signup.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ServicesService } from '../services.service';

@Component({
  selector: 'app-login-singup',
  templateUrl: './login-singup.component.html',
  styleUrl: './login-singup.component.css'
})
export class LoginSingupComponent {

  loginFormgroup : FormGroup;
  private role = new BehaviorSubject<string>('');

  constructor (private _dialog: MatDialog ,private formbuilder:FormBuilder, private _auth: AuthServiceService ,private _rout: Router,private _http: HttpClient,private _userSer:ServicesService) {

    this.loginFormgroup = this.formbuilder.group({

      username: '',
      password: ''

    })
}
openAddEditeForm(){
  const dialogRef =this._dialog.open(SignupComponent);}

onSubmit() : void { 

   

}

call_login(username_For_login:string ,password_For_login:string){
  this.login(username_For_login, password_For_login).subscribe(
    response => {
      console.log('Login successful:', response);
    },
    error => {
     
      console.error('Login error:', error);

    }
  );

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
  loginnn(name: string, password: string): Observable<any> {
    debugger
    const body = {
      Username: name,
      pass: password
    };
    
    return this._http.post<any>('https://localhost:7107/Login', body);
  }

Login(){
  
  const username = this.loginFormgroup.value.username;
  const password = this.loginFormgroup.value.password;
  this._auth.authenticate(username, password).subscribe({
    next: (val: { authenticated: boolean, isAdmin: boolean }) => {
      if (val.authenticated) {
        if (val.isAdmin) {
          alert("User login successfully as Admin");
          this._rout.navigate(['/Home']);
        } else {
          alert("User login successfully ");
          this._rout.navigate(['/userPage']);
        }
      } else {
        alert("Authentication failed");
      }
    },
    error: (error) => {
      console.error('Error during authentication:', error);
      alert("Authentication failed");
    }
  });
}
}