import { Component } from '@angular/core';
import { FormBuilder , FormGroup } from '@angular/forms';
import { AuthServiceService } from '../auth-service.service';
import { Router } from '@angular/router';
import { AddUpdateUserComponent } from '../add-update-user/add-update-user.component';
import { MatDialog } from '@angular/material/dialog';
import { SignupComponent } from '../signup/signup.component';

@Component({
  selector: 'app-login-singup',
  templateUrl: './login-singup.component.html',
  styleUrl: './login-singup.component.css'
})
export class LoginSingupComponent {

  loginFormgroup : FormGroup;

  constructor (private _dialog: MatDialog ,private formbuilder:FormBuilder, private _auth: AuthServiceService ,private _rout: Router) {

    this.loginFormgroup = this.formbuilder.group({

      username: '',
      password: ''

    })
}
openAddEditeForm(){
  const dialogRef =this._dialog.open(SignupComponent);}

onSubmit() : void { 
  
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