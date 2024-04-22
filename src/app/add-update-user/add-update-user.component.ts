import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServicesService } from '../services.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MatListModule} from '@angular/material/list';
import { MainPageComponent } from '../main-page/main-page.component';
@Component({
  selector: 'app-add-update-user',
  templateUrl: './add-update-user.component.html',
  styleUrl: './add-update-user.component.css',
})
export class AddUpdateUserComponent implements OnInit {
usersForm: FormGroup;
typesOfRoles: string[] = ['Admin', 'User'];
constructor(
  private _fb: FormBuilder, private _userServies: ServicesService, private _dialogRef: MatDialogRef<AddUpdateUserComponent>, @Inject(MAT_DIALOG_DATA) public data: any)
  {
    this.usersForm = this._fb.group({
      userName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required], 
    });
  }
  ngOnInit(): void {
    
    this.usersForm.patchValue(this.data);
  }
  onSelectionChange(shoes: any) {
    const selectedValues = shoes.selectedOptions.selected.map((option: { value: any; }) => option.value);
    debugger
    this.usersForm.patchValue({
      role: selectedValues
    });
  }
   
    
    onFormSubmit() {
      if (this.usersForm.valid){
        if(this.data){
          
          this._userServies.updateUSer(this.data.id,this.usersForm.value).subscribe({
            next: (val: any)=>{
              
              alert("User Updated successfully");
              this._dialogRef.close(true);  
            },
            error:(err:any)=>{
              console.error(err);
            },
          });

        }
        else{
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
} 
