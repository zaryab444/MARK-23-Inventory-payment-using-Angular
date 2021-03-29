import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { EmailDialogComponent } from '@fuse/components/email-dialog/email-dialog.component';
import { truncateTextLength } from '../../../../../constants/globalFunctions';
import { UserConfigService } from '@fuse/services/user.config.service';
import { MerchantService } from '../merchant.service';
import { SlidingPanelService } from '@fuse/components/sliding-panel/sliding-panel.service';

@Component({
  selector: 'app-merchant-table',
  templateUrl: './merchant-table.component.html',
  styleUrls: ['./merchant-table.component.scss'],
  animations   : fuseAnimations
})
export class MerchantTableComponent implements OnInit {
  public truncateTextLength = truncateTextLength;
  public recordCount: number = 0;

  public dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
 
  public displayedColumns : string[] =  ['Reseller.ResellerName', 'MerchantAccountSetup.MerchantUserName', 'ContactPerson', 'MerchantAccountSetup.MerchantEmail', 'MerchantAccountSetup.PricingTitle', 'BoardedDate', 'MerchantAccountSetup.BoardingStatus'];
  @Input() data: any;
  @Output() ExportCall = new EventEmitter<any>();
  public actionControlOnHover = -1;
  @ViewChild('boardingLinkDialog') boardingLinkDialog: any;
  public dialogRef: any;
  public merchantData: any;



  constructor(private readonly _dialog: MatDialog,
    private readonly _userConfigService: UserConfigService,
    private readonly _merchantService: MerchantService,
    private readonly _slidingPanelService:SlidingPanelService,
    
    ) {
      
     }
  

  ngOnInit(): void{
    if(this.data){
      this.dataSource.data = this.data.merchants;
      this.dataSource.paginator = this.paginator;
     this.sorting(this.data);
    }
  }
  getPropertyByPath(obj: Object, pathString: string) {
    return pathString.split(".").reduce((o, i) => o[i], obj);
  }
  sorting(data): void{
    if(this.data){
      this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (data, sortHeaderId: string) => {
      return this.getPropertyByPath(data, sortHeaderId);
    };
    }
  }
  
  ngAfterViewInit(): void{
    setTimeout(() =>  this.recordCount = this.data.merchantCount, 0);
  }

  openDialog(obj) {
    const object:any = {
      SendTo: obj.MerchantAccountSetup.MerchantEmail,
      Subject: obj.EmailSubject,
      BodyContent: obj.EmailBody,
      MerchantName: `${obj.FirstName} ${obj.LastName}`,
      PartnerId: obj.PartnerId,
      MerchantId:obj.MerchantId

    }
    const dialogRef = this._dialog.open(EmailDialogComponent, {width: '660px'});
    dialogRef.componentInstance.data = object;
  } 

  changePage(event){ 
    const obj = {
      RecordLimit: event.pageSize,
      PageNo: ++event.pageIndex,
      ...this._userConfigService.getUserMode()
    };
    this._merchantService.merchantList(obj)
    .then((res: any) => {
      if (res && !res.StatusCode) {
        if (res.Response ) {
          this.dataSource = new MatTableDataSource<any>();
          this.dataSource.data = res.Response.Merchants;
          this.sorting(this.data);
        }
      }
    }).catch(() => (console.log))
  }
  exportFile(value){
    let obj = {ExportType: value,'IsExport': true};
    this.ExportCall.emit(obj);
  }

  boardingLink(x){
      this.merchantData = x
    this.dialogRef = this._dialog.open(this.boardingLinkDialog, { width: '600px' });
    
  }
}
