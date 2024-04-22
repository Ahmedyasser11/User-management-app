import { Component,ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { ServicesService } from '../services.service';
import { AddUpdateUserComponent } from '../add-update-user/add-update-user.component';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {

  displayedColumns: string[] = ['id', 'userName','email','phoneNumber','action'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  constructor(private _dialog: MatDialog,private _userSer:ServicesService,private _http:HttpClient){}
  
  openAddEditeForm(){
    const dialogRef =this._dialog.open(AddUpdateUserComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getusers();
        }
      },
    });
  }
  getusers() {
    this._http.get<any>('https://localhost:7107/User/GetAllUsers').subscribe(response => {
      const data = response.data; 
      if (Array.isArray(data)) {
        this.dataSource = new MatTableDataSource<any>(data);
        this.dataSource.paginator = this.paginator;
      } else {
        console.error('Invalid data format:', response);
      }
    }, error => {
      console.error('Error fetching users:', error);
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  deleteUser(userId: string) {
    
    this._userSer.deleteUser(userId).subscribe({
      next: (res) =>{
        alert('User deleted');
        this.getusers();
      },
      error: console.log,

    })  
  }

  UpdateUser(data: any) {
    
    const dialogRef = this._dialog.open(AddUpdateUserComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getusers();
        }
      },
    }); 
  }
  UpdateUserRole(userId: string) {
    x :String;
    const x="Admin";
    debugger
    this._userSer.addRole(userId,x).subscribe({
      next: (res) =>{
        debugger
        alert('Admin role added to this user');
        this.getusers();
      },
      error: console.log,

    })  
    }
}
