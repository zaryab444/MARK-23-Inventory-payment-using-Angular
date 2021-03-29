import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserConfigService } from '@fuse/services/user.config.service';
import { snackBarConfig } from 'constants/globalFunctions';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';
import { SettingService } from '../../settings.service';

@Component({
  selector: 'app-api-key',
  templateUrl: './api-key.component.html',
  styleUrls: ['./api-key.component.scss']
})
export class ApiKeyComponent implements OnInit {
  public appInfo = environment;
  public apikey;
  public showApiKey: any = '';
  private _unsubscribeAll: Subject<any>;
  /**
   * Constructor
   * @param {MatSnackBar} _snackBar
   * @param {SettingService} _settingService,
   * @param {UserConfigService} _userConfigService
   */
  constructor(
    private readonly _settingService: SettingService,
    private readonly _userConfigService: UserConfigService,
    private readonly _snackBar: MatSnackBar,
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this._userConfigService.userModeChange
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => this.opendialog());
    this.showApiKey = '';
  }
  
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  opendialog() {
    let obj;
    obj = this._userConfigService.getUserMode();
  
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
    else if(obj.hasOwnProperty('PartnerId')){
          obj = {
              EntityId: obj.PartnerId,
              UserRoleId: 3
          }
      }
      else if(obj.hasOwnProperty('ResellerId')){
        obj = {
            EntityId: obj.ResellerId,
            UserRoleId: 4
        }
       
      }
      else if(obj.hasOwnProperty('MerchantId')){
        obj = {
            EntityId: obj.MerchantId,
            UserRoleId: 2
        }
    
      }
      else if(obj.hasOwnProperty('LocationId')){
        obj = {
            EntityId: obj.LocationId
        
        }
      }

    
   
    this.showApiKey = '';
    this._settingService.getAuthKey(obj)
      .then((res: any) => {
        if (res.Response && !res.StatusCode) {
          this.apikey = res.Response.Key;
        }
    
        else{
            this.apikey= 'Key not Found';
        }
      }).catch((err: HttpErrorResponse) => (console.log))
  }
  opendialog1() {
    this.showApiKey = "open";
  }

  onclick() {
    if (this.apikey) {
      this._snackBar.open('Copied', '', snackBarConfig);
    }
  }
}
