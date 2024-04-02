import { Component,ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { ServicesService } from '../services.service';
import { AddUpdateUserComponent } from '../add-update-user/add-update-user.component';
@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {
  static getusers() {
    throw new Error('Method not implemented.');
  }
  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'email','gender','role','action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private _dialog: MatDialog,private _userSer:ServicesService){}
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
  public getusers(){
    this._userSer.getuser().subscribe({
      next: (res)=>{
       this.dataSource = new MatTableDataSource(res);
       this.dataSource.sort= this.sort;
       this.dataSource.paginator=this.paginator;
      },
      error: console.log,
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  deleteUser(id: number) {
    debugger
    this._userSer.deleteUser(id).subscribe({
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
}
