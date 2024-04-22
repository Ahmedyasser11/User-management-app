import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServicesService } from '../services.service';
import { MatDialogRef } from '@angular/material/dialog';
import { AddUpdateUserComponent } from '../add-update-user/add-update-user.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  usersForm: FormGroup;
  typesOfShoes: string[] = ['Admin', 'User'];
  constructor(
    private _fb: FormBuilder, private _userServies: ServicesService, private _dialogRef: MatDialogRef<AddUpdateUserComponent>,private _http:HttpClient)
    {
      this.usersForm = this._fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: ['', Validators.required],
      
      
      });
    }
      onFormSubmit() {
        
        if (this.usersForm.valid){
          
          this.register(this.usersForm.value).subscribe({
            next: (val: any)=>{
              alert("User Added successfully");
              this._dialogRef.close(true);
            },
            error:(err:any)=>{
              console.error(err);
            },
          });
        }
      }
      register( x:any){
        const headers = new HttpHeaders({
          'Content-Type': 'application/json'
        });
        debugger
        return this._http.post<any>('https://localhost:7107/Register', x, { headers: headers }).pipe(
          map(response => {
            
            if (response.statusCode === 200) {
              console.log("user add successfully")
            } else {
              console.log('Cant add this user');
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
  