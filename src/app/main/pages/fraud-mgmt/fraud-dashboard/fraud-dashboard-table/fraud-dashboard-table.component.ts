import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-fraud-dashboard-table',
  templateUrl: './fraud-dashboard-table.component.html',
  styleUrls: ['./fraud-dashboard-table.component.scss']
})

export class FraudDashboardTableComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol','reason','result'];
  public dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild (MatPaginator, { static:true }) paginator: MatPaginator;
  @ViewChild (MatSort, { static: true }) sort: MatSort
  constructor() { }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  ngAfterViewInit() {
   
  }
}
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  reason: string;
  result: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H', reason:'no reason' ,result:'pending result'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He', reason:'no reason' ,result:'pending result'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li', reason:'no reason' ,result:'pending result'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be', reason:'no reason' ,result:'pending result'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B', reason:'no reason' ,result:'pending result'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C', reason:'no reason' ,result:'pending result'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N', reason:'no reason' ,result:'pending result'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O', reason:'no reason' ,result:'pending result'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F', reason:'no reason' ,result:'pending result'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne', reason:'no reason' ,result:'pending result'},
  {position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na', reason:'no reason' ,result:'pending result'},
  {position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg', reason:'no reason' ,result:'pending result'},
  {position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al', reason:'no reason' ,result:'pending result'},
  {position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si', reason:'no reason' ,result:'pending result'},
  {position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P', reason:'no reason' ,result:'pending result'},
  {position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S', reason:'no reason' ,result:'pending result'},
  {position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl', reason:'no reason' ,result:'pending result'},
  {position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar', reason:'no reason' ,result:'pending result'},
  {position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K', reason:'no reason' ,result:'pending result'},
  {position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca', reason:'no reason' ,result:'pending result'},
];
