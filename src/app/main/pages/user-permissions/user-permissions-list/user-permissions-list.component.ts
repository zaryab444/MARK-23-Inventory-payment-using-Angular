import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewChecked, AfterViewInit, Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { NoFoundComponent } from '@fuse/components/no-found/no-found.component';
import { UserConfigService } from '@fuse/services/user.config.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MerchantTableComponent } from '../../merchant/merchant-table/merchant-table.component';
import { PartnerTableComponent } from '../../partner/partner-table/partner-table.component';
import { ResellerTableComponent } from '../../reseller/reseller-table/reseller-table.component';
import { UserService } from '../../user/user.service';
import { UserPermissionsTableComponent } from '../user-permissions-table/user-permissions-table.component';

@Component({
  selector: 'app-user-permissions-list',
  templateUrl: './user-permissions-list.component.html',
  styleUrls: ['./user-permissions-list.component.scss']
})
export class UserPermissionsListComponent implements OnInit, AfterViewInit {
  @ViewChild('renderingContainer', { read: ViewContainerRef }) container: ViewContainerRef;
  @ViewChild('mySel') skillSel: MatSelect;
  toppingList = [
    {name:'Partner' ,value:3},
    {name: 'Reseller',value:4},
    {name: 'Merchant', value:2}
  ]
  public allSelected = false;
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
  private componentRef: ComponentRef<any>;

  public Role: '';
  private _unsubscribeAll: Subject<any>;
  users: any;


 constructor(
  private readonly _userService: UserService,
  private readonly _userConfigService: UserConfigService,
  private readonly _resolver: ComponentFactoryResolver,
  private actRoute: ActivatedRoute
)
  {
    this._unsubscribeAll = new Subject();
   }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.renderingComponent(NoFoundComponent, {
        icon: 'no-transaction',
        text: 'No user found'
      });
    }, 2000);
  }


  ngOnInit(): void {
      this._userConfigService.userModeChange
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe( () => this.renderTable());
   
  }
  renderTable() {
      const user = this._userConfigService.getUserMode();
      
    if((user && user.hasOwnProperty('MerchantId')) || (user && user.hasOwnProperty('PartnerId')) || (user && user.hasOwnProperty('ResellerId'))) {
      this.renderingComponent(UserPermissionsTableComponent, this.menuList)
    }
    // if(user && user.hasOwnProperty('PartnerId')) {
    //   this.renderingComponent(UserPermissionsTableComponent, this.dummyTablePartner)
    // }
    // if(user && user.hasOwnProperty('ResellerId')) {
    //   this.renderingComponent(UserPermissionsTableComponent, this.dummyTableReseller)
    // }
  }
  
  userList(val?) {
    this._userService.userList(this._userConfigService.getUserMode())
    .then((res: any) => {
      if (res && !res.StatusCode) {
        if (res.Response && res.Response.Users.length) {
          this.users = res.Response.Users;
          this.renderingComponent(UserPermissionsTableComponent, {
            users: this.users,
          })
        } else {
          this.renderingComponent(NoFoundComponent, {
            icon: 'no-transaction',
            text: 'No user found'
          });
        }
      }
    }).catch((err: HttpErrorResponse) => (console.log))
  }
  renderingComponent(type, data?) {
    const factory: ComponentFactory<any> = this._resolver.resolveComponentFactory(type);
    this.container && this.container.clear();
    this.componentRef = this.container.createComponent(factory);
    this.componentRef.instance.data = data;
  }
  toggleAllSelection() {
    this.allSelected = !this.allSelected;  // to control select-unselect
    if (this.allSelected) {
      this.skillSel.options.forEach((item: MatOption) => item.select());
    } else {
      this.skillSel.options.forEach((item: MatOption) => { item.deselect() });
    }
    this.skillSel.close();
  }

}
