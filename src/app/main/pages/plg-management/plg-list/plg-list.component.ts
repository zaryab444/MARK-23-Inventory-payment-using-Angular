import { HttpErrorResponse } from '@angular/common/http';
import { Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NoFoundComponent } from '@fuse/components/no-found/no-found.component';
import { UserConfigService } from '@fuse/services/user.config.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as globalConfig from '../../../../../constants/globalFunctions';
import { SettingService } from '../../settings/settings.service';
import { PlgTableComponent } from '../plg-table/plg-table.component';
import { authRole } from '../../../../../constants/globalFunctions';

@Component({
  selector: 'app-plg-list',
  templateUrl: './plg-list.component.html',
  styleUrls: ['./plg-list.component.scss']
})
export class PlgListComponent implements OnInit {
  @ViewChild('renderingContainer', { read: ViewContainerRef }) container: ViewContainerRef;
 
  private componentRef: ComponentRef<any>;
  private _unsubscribeAll: Subject<any> ;
  public partnerSearchForm: FormGroup;
  public globalConfig = globalConfig;
  public panelChangesSubscriber: any;
  public plgData: any;
  public authRoleadmin = authRole.admin;
  public userType: any;
  /**
  * Constructor
  *
  * @param {UserConfigService} _userConfigService
  * @param {ComponentFactoryResolver} _resolver
  * @param {SlidingPanelService} _slidingPanelService
  */

  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _settingService: SettingService,
    private readonly _userConfigService: UserConfigService,
    private readonly _resolver: ComponentFactoryResolver,
  ) {
    this._unsubscribeAll = new Subject();
  }
  ngOnInit(): void {
    this._userConfigService.userModeChange
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(() => this.getPlgManager());
    this.userType =   this._userConfigService.loggedInUser.UserRoleId;
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
    this.componentRef && this.componentRef.destroy();
  }
  renderingComponent(type, data?, containerValue?) {
    if (containerValue) {
      const factory: ComponentFactory<any> = this._resolver.resolveComponentFactory(type);
      this.componentRef = this.container.createComponent(factory);
      this.componentRef.instance.data = data.data;
    }
    else {
      const factory: ComponentFactory<any> = this._resolver.resolveComponentFactory(type);
      this.container.clear();
      this.componentRef = this.container.createComponent(factory);
      this.componentRef.instance.data = data;
    }
  }
  getPlgManager(value?): void {
   const obj= {
    ...this._userConfigService.getUserMode(), 
    ...value
    }
    this._settingService.getPlgManager(obj)
      .then((res: any) => {
        if (res && !res.StatusCode) {
          if (res.Response && res.Response.length) {
            this.plgData = res.Response
            this.renderingComponent(PlgTableComponent, {
              plg: res.Response,
            })
          } else {
            this.renderingComponent(NoFoundComponent, {
              icon: 'no-partner',
              text: 'No Partner(s) Found',
              subText: "You haven't made any Partner"
            });
          }
        }
      }).catch((err: HttpErrorResponse) => (console.log))
  } 
}
