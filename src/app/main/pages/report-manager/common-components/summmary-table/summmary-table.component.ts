import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import * as moment from 'moment';

@Component({
  selector: 'app-summmary-table',
  templateUrl: './summmary-table.component.html',
  styleUrls: ['./summmary-table.component.scss'],
  animations: fuseAnimations
})
export class SummmaryTableComponent implements OnInit {
  public columns: Array<any>
  public dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  public displayedColumns: Array<any>
  @Input() data: any;
  @Output() update = new EventEmitter<any>();
  @Output() ExportCall = new EventEmitter<any>();
  public defaultData: any;
  public disabledRow = false

  constructor() { }

  ngOnInit(): void {
    if (this.data) {
      this.defaultData = this.data.data;
      this.setData(this.data);
    }
  }
  setData(data) {
    const columns = this.data.data
      .reduce((columns, row) => {
        return [...columns, ...Object.keys(row)]
      }, [])
      .reduce((columns, column) => {
        return columns.includes(column)
          ? columns
          : [...columns, column]
      }, [])
    this.columns = columns.map(column => {
      return {
        columnDef: column,
        header: column,
        cell: (element: any) => `${element[column]}`
      }
    })
    this.displayedColumns = this.columns.map(c => c.columnDef);
    this.displayedColumns.shift();
    this.dataSource.data = this.data.data;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  detailRow(data) {
    if (data.hasOwnProperty('PartnerId')) {
      const obj = {
        EntityId: data.PartnerId,
        UserRoleId: 3,
      }
      this.update.emit(obj);
    } else if(data.hasOwnProperty('ResellerId')) {
      const obj = {
        EntityId: data.ResellerId,
        UserRoleId: 4
      }
      this.update.emit(obj);
    } else if(data.hasOwnProperty('MerchantId')) {
      const obj = {
        EntityId: data.MerchantId,
        UserRoleId: 2
      }
      this.update.emit(obj);
    } else {
      this.disabledRow = true
    }  
  }
  exportFile(value){
    let obj = {ExportType: value,'IsExport': true,...this.data.currentUser};
    this.ExportCall.emit(obj);
  }
}
