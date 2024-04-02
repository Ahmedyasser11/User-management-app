import { Component,ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { ServicesService } from '../services.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css'
})
export class UserPageComponent {
 
  displayedColumns: string[] = [ 'firstName', 'lastName', 'email','gender','role'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private _dialog: MatDialog,private _userSer:ServicesService){}
  
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
}
