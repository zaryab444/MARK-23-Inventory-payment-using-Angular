import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { OverlayLockService } from '@fuse/components/overlay-lock/overlay-lock.service';

import { UserConfigService } from '@fuse/services/user.config.service';
import { FraudMgmtService } from '../../fraud-mgmt.service';
import { TransactionControlsService } from '../transaction-controls.service';



@Component({
  selector: 'app-country-origin',
  templateUrl: './country-origin.component.html',
  styleUrls: ['./country-origin.component.scss']
})
export class CountryOriginComponent implements OnInit {
   
     public ipAddress: any[] = [];
  public data:any;
  public lockingDetails: any;
  public fraudStatus: any;
  public fraudStatusComponent : boolean = false;
  public lockComponent : boolean = false;
  public updateIpAddress:any;
  public fraudTypeLock : any;
  @Input() fraudType : any;
    disableForms: boolean;
    currentUser: any;
   

  constructor(
    private readonly _userConfigService: UserConfigService,
    private readonly _fraudManagementService: FraudMgmtService,
    private readonly _transactionControlsService: TransactionControlsService,
    private readonly _overlayLockService: OverlayLockService
  ) { }

  ngOnInit() {
    this.currentUser = this._userConfigService.loggedInUser
    if(this.fraudType == 1) {
      this.fraudTypeLock = this.fraudType;
      console.log();
      this.getLockSettings(this.fraudTypeLock);
      this.getFraudStatus(this.fraudTypeLock)

    }
  }

  getLockSettings(obj?) : any {
    this._fraudManagementService.lockSettings({...this._userConfigService.getUserMode(), FraudTypeId: obj})
    .then((res:any)=> {
      if(res && !res.StatusCode) {
       this.lockingDetails = res.Response[0];
       this.lockComponent = true;
     //  this._overlayLockService.getOverLay('overlay-country').toggleOpen();
       this.disableForms = true;
      }
    })
  }

  getFraudStatus(obj?) : any {
      let objUser = this._userConfigService.getUserMode()
      delete objUser.AdminId
    this._fraudManagementService.CountryOfOriginStatus({...objUser, FraudType: obj })
    .then((res:any)=> {
      if(res && !res.StatusCode) {
       this.fraudStatus = res.Response;
       this.fraudStatusComponent = true;
       console.log(this.fraudStatus,"this.fraudStatus")
      }
    })
  }



}
