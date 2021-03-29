import { HttpErrorResponse } from '@angular/common/http';
import { Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { NoFoundComponent } from '@fuse/components/no-found/no-found.component';
import { UserConfigService } from '@fuse/services/user.config.service';
import { valuesIn } from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserTableComponent } from '../user-table/user-table.component';
import { UserService } from '../user.service';
import { SlidingPanelService } from '@fuse/components/sliding-panel/sliding-panel.service';
import { AdvancedSearchComponent } from '@fuse/components/advanced-search/advanced-search.component';
import { authRole } from 'constants/globalFunctions';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit, OnDestroy {
  @ViewChild('renderingContainer', { read: ViewContainerRef }) container: ViewContainerRef;
  private componentRef: ComponentRef<any>;
  @Input() headerVisibility: boolean = true;
  @Input() getUserBy: any = {};
  public userSearch: any[] = [];
 public searchObject:any = {} ;

  public users: any = [];
  private _unsubscribeAll: Subject<any>;
  public panelChangesSubscriber: any;
    userCreateObj: any = {};

  /**
  * Constructor
  *
  * @param {ResellerService} _resellerService
  * @param {UserConfigService} _userConfigService
  * @param {ComponentFactoryResolver} _resolver
  * @param {SlidingPanelService} _slidingPanelService
  */

  constructor(
    private readonly _userService: UserService,
    private readonly _slidingPanelService: SlidingPanelService,
    private readonly _userConfigService: UserConfigService,
    private readonly _resolver: ComponentFactoryResolver
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.getSearchingUser();
    if (this.headerVisibility){
    this._userConfigService.userModeChange
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => this.getUsers());
  }
 
  this.panelChangesSubscriber = this._slidingPanelService.panelChange.subscribe((res: any) => {
    if (res== "CreateUser" || res== "UpdateUser") {
      if( this.searchObject && this.searchObject.hasOwnProperty('search')) {
        this.getUsers(this.searchObject)
      } else {
        this.getUsers(this.getUserBy);
      }
    }  
  })
  }
  ngOnChanges(): void {
    if ((this.getUserBy.PartnerId || this.getUserBy.ResellerId) &&
      Object.keys(this.getUserBy).length &&
      Object.values(this.getUserBy).toString()) {
        this.getUsers(this.getUserBy);
    }
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
    this.componentRef && this.componentRef.destroy();
    this.panelChangesSubscriber.unsubscribe();
  }
  renderingComponent(type, data?) {
    const factory: ComponentFactory<any> = this._resolver.resolveComponentFactory(type);
    this.container.clear();
    this.componentRef = this.container.createComponent(factory);
    this.componentRef.instance.data = data;
    this.componentRef.instance.CallExport.subscribe(res => {
      if (res) {
        this.getUsers(res);
      }
    })
 

  }
  getUsers(val?): void {
    let obj;
    
    obj = this._userConfigService.getUserMode()
    if(obj == null )
    {
        obj = {};
    }
    else if(obj.hasOwnProperty('UserRoleId')){

      if(obj.UserRoleId == 1)
      {
        obj = {}
      }
    }
 

    if(this.headerVisibility){
        delete obj.UserRoleId;
        delete obj.EntityId;
        delete obj.isUserAdd
        }
    

    if(val !== undefined && val.hasOwnProperty('isUserAdd')){
        obj = val
    }
    if(this.searchObject && this.searchObject.hasOwnProperty('search')) {
      delete this.searchObject.UserRoleId;
      delete this.searchObject.EntityId;
      delete this.searchObject.AdminId;
      delete this.searchObject.PartnerId;
      delete this.searchObject.ResellerId;
      delete this.searchObject.MerchantId;


     const tobj = {...this.searchObject,...obj}
     obj = tobj
    }
    if(val?.IsExport){
       obj = {
        ...this.getUserBy,
         ...obj,
         ...val
       }
      }
    this._userService.userList(obj)
      .then((res: any) => {
        if (res && !res.StatusCode) {
          if (res.Response && res.Response.Users.length) {
            this.users = res.Response.Users;
            if(res.Response.FileUrl){
           
              let url = res.Response.FileUrl
              window.open(url, "_blank"); 
            }
            this.renderingComponent(UserTableComponent, {
              users: this.users,
              currentuser: this.getUserBy,
              showRole: this.headerVisibility
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
  openSlidePanel(): void {
    this._slidingPanelService.getSidebar('slidePanel', 'UserCreateComponent',this.getUserBy).toggleOpen();
  }

  getSearchingUser(){
    this.userSearch = [
      {
      label: "User Role", ControlName: "UserRoleID", option:[
        {
          value: "All",
          text: "All"
        },{
          value: authRole.admin,
          text: "Admin"
        },
        {
          value: authRole.partner,
          text: "Partner"
        },
        {
          value: authRole.reseller,
          text: "Reseller"
        },
        {
          value: authRole.merchant,
          text: "Merchant"
        }
      ]},
      {label: "Status", ControlName: "Status", option:[
        {
          value: "All",
          text: "All"
        },{
          value: 1,
          text: "Active"
        },
        {
          value: 0,
          text: "InActive"
        }
      ]},
      {label: "Username", ControlName: "Username"},
      {label: "First Name", ControlName: "FirstName" },
      {label: "Last Name", ControlName: "LastName"},
      {label: "Phone", ControlName: "Phone", mask: "(000) 000-0000"}
    ]
  }
  searchingUser(obj){
   
    this.searchObject = obj;
     let a = {
       search: 'userSearch'
     }
    if (obj.hasOwnProperty('Role') || obj.hasOwnProperty('Status')) {
      if (obj.UserRoleID =='All') {
        obj.UserRoleID = null
      }
      if (obj.Status =='All') {
        obj.Status = null
      }
    }
    obj = {...a, ...obj};
    this.searchObject = obj;
    this.getUsers(obj);
  }
}
