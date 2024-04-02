import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServicesService } from '../services.service';
import { MatDialogRef } from '@angular/material/dialog';
import { AddUpdateUserComponent } from '../add-update-user/add-update-user.component';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  User: any;
  Admin: any;
  usersForm: FormGroup;
  typesOfShoes: string[] = ['Admin', 'User'];
  constructor(
    private _fb: FormBuilder, private _userServies: ServicesService, private _dialogRef: MatDialogRef<AddUpdateUserComponent>)
    {
      this.usersForm = this._fb.group({
        firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      passwoord: ['', Validators.required],
      role: 'user',
      gender: ['', Validators.required],
      
      });
    }
      onFormSubmit() {
        if (this.usersForm.valid){
          this._userServies.addUser(this.usersForm.value).subscribe({
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
    } 
  