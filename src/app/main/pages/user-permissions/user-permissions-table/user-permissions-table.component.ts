import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { UserConfigService } from '@fuse/services/user.config.service';
import { truncateTextLength } from 'constants/globalFunctions';
import { environment } from 'environments/environment';
import { PartnerService } from '../../partner/partner.service';
import { SettingService } from '../../settings/settings.service';

@Component({
  selector: 'app-user-permissions-table',
  templateUrl: './user-permissions-table.component.html',
  styleUrls: ['./user-permissions-table.component.scss'],
  encapsulation:ViewEncapsulation.None,
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0', minHeight: '0', visibility: 'hidden', display:'none' })),
      state('expanded', style({ height: 'auto', minHeight: '48px', visibility: 'visible',  display:'block', width: '100%'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ]),
    // trigger('detailExpandRefund', [
    //   state('collapsed', style({ height: '0px', minHeight: '0' })),
    //   state('expanded', style({ height: '*' })),
    //   transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    // ]),
    fuseAnimations,
  ]
})
export class UserPermissionsTableComponent implements OnInit {
  public appInfo = environment;
  public truncateTextLength = truncateTextLength ;
  public dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @Input() data: any;
  public recordCount: number = 0;
  public actionControlOnHover = -1;
  public displayedCol: string[] =  ['Checked', 'name', 'description', 'permission'];
  public logo: string;
  public expandedRowDetail: any;
  public menuList = [
    { Checked: true , name: 'Dashboard', description: 'Activity', permission: true},
    { Checked: true , name: 'Partners', description: 'Activity', permission: false },
    { Checked: false , name: 'Resellers', description: 'Activity', permission: true},
    { Checked: false , name: 'Merchants', description: 'Activity', permission: false },
    { Checked: true,  name: 'Pricing Plan', description: 'Activity', permission: true },
    { Checked: true,  name: 'Make A Sale', description: 'Activity', permission: true},
    { Checked: false,  name: 'Reports', description: 'Activity', permission: true },
    { Checked: true,  name: 'Transactions', description: 'Activity', permission: false},
    { Checked: false ,  name: 'Funding Manager', description: 'Activity', permission: true },
    { Checked: true , name: 'User Managment', description: 'Activity', permission: true},
    { Checked: false ,  name: 'Fraud Managment', description: 'Activity', permission: true},
    { Checked: true ,  name: 'PLG Manager', description: 'Activity', permission: true},
    { Checked: true,  name: 'Settings', description: 'Activity', permission: true},
    { Checked: false,  name: 'Activity', description: 'Activity', permission: true},
  ]

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
  // @ViewChild(MatPaginator) paginator: MatPaginator;
//   public displayedColumns: string[] = this.displayedCol.slice();

  ngOnInit(): void{
    if(this.data){
      this.dataSource.data = this.data;
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
 
}
