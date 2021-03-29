import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit,Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { snackBarConfig, truncateTextLength } from '../../../../../constants/globalFunctions';
import { SettingService } from '../../settings/settings.service';
import { UserConfigService } from '@fuse/services/user.config.service';
import { ResellerService } from '../reseller.service';
import { SlidingPanelService } from '@fuse/components/sliding-panel/sliding-panel.service';

@Component({
  selector: 'app-reseller-table',
  templateUrl: './reseller-table.component.html',
  styleUrls: ['./reseller-table.component.scss'],
  animations   : fuseAnimations
})
export class ResellerTableComponent implements OnInit,AfterViewInit {
  public truncateTextLength = truncateTextLength;
  public dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @Input() data: any;
  @Output() ExportCall = new EventEmitter<any>();
  public recordCount: number = 0;
  public actionControlOnHover = -1;
  public displayedColumns: string[] = ['PartnerName', 'ResellerName', 'ContactPerson', 'Email', 'TelephoneNumber'];
   /**
     * Constructor
     *
     * @param {ResellerService} _resellerService
     * @param {MatSnackBar} _snackBar
     * @param {MatDialog} _dialog
     */
  constructor(
    private readonly _dialog: MatDialog,
    private readonly _snackBar: MatSnackBar,
    private readonly _settingService: SettingService,
    private readonly _userConfigService: UserConfigService,
    private readonly _resellerService: ResellerService,
    private readonly _slidingPanelService:SlidingPanelService

  ) { }

  ngOnInit() : void{
    if(this.data){
      this.dataSource.data = this.data.resellers;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      if (this.data.hideCol && this.displayedColumns.length) {
        this.displayedColumns = this.displayedColumns.slice(2);
      }
    }
  
  }


  openDialog(id): void { 
    const dialogRef = this._dialog.open(FuseConfirmDialogComponent, {width: '550px'});
    dialogRef.componentInstance.data={
      title: "Resend Welcome Email",
      message:"Are you sure you want to resend welcome email?"
    }
    dialogRef.afterClosed().subscribe((result)=>{
      if (result){
        this.resendEmail(id);
      }
    })
  }

  resendEmail(id) {
    this._settingService.resendCredentials({ResellerId : id}).then((res:any) => {
      if(res && !res.StatusCode){
       this._snackBar.open('Welcome email has been sent successfully', '', snackBarConfig);
     } 
  }).catch((err: HttpErrorResponse)=>(console.log));

}
ngAfterViewInit(): void{
  setTimeout(() =>  this.recordCount = this.data.resellerCount, 0);
}
ngOnDestroy() : void {
  this._slidingPanelService.setSlidingPanelStatus(null);
}

  changePage(event){ 
    const obj = {
      RecordLimit: event.pageSize,
      PageNo: ++event.pageIndex,
      ...this._userConfigService.getUserMode()
    };
    this._resellerService.resellerList(obj)
    .then((res: any) => {
      if (res && !res.StatusCode) {
        if (res.Response &&
          res.Response.Resellers &&
          res.Response.Resellers.length)  {
          this.dataSource = new MatTableDataSource<any>();
          this.dataSource.data = res.Response.Resellers;
          this.dataSource.sort = this.sort;
        }
      }
    }).catch(() => (console.log))


  }
  exportFile(value){
    let obj = {ExportType: value,'IsExport': true};
    this.ExportCall.emit(obj);
  }
}
