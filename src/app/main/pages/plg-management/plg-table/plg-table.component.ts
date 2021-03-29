import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { UserConfigService } from '@fuse/services/user.config.service';
import { snackBarConfig, truncateTextLength } from 'constants/globalFunctions';
import { PartnerService } from '../../partner/partner.service';
import { SettingService } from '../../settings/settings.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-plg-table',
  templateUrl: './plg-table.component.html',
  styleUrls: ['./plg-table.component.scss'],
  animations: fuseAnimations
})
export class PlgTableComponent implements OnInit {
  public appInfo = environment;
  public truncateTextLength = truncateTextLength ;
  public dataSource = new MatTableDataSource<any>()
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @Input() data: any;
  public recordCount: number = 0;
  public actionControlOnHover = -1;
  public displayedColumns: string[] =  ['PartnerName', 'DomainName', 'logoImageUrl', 'colorTheme'];
  logo: string;
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
    private readonly _partnerService: PartnerService,
  ) { }

  ngOnInit(): void{
    if(this.data){
      this.dataSource.data = this.data.plg;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }
  imageUrl(value) {
   return this.checkForEnvironment(value)
  }
  defaultUrl(value) {
   return this.logo = 'assets/images/'+`${this.appInfo.assetPathName}`+'-logos/logo.svg';
  }
  checkForEnvironment(url) {
    if(environment.dev == true) {
       return this.logo = `${environment.apiURL.split('api/').shift()}${'api/'}${url.split("~/").pop()}`
    } else {
       return this.logo = `${environment.apiURL.split('api/').shift()}${url.split("~/").pop()}`
    }
}
  ngAfterViewInit(): void{
    // setTimeout(() =>  this.recordCount = this.data.partnerCount, 0);
  }  
}
