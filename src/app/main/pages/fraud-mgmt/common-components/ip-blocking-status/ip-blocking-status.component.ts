import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserConfigService } from '@fuse/services/user.config.service';
import * as globalConfig from '../../../../../../constants/globalFunctions';
import { TransactionControlsService } from '../../transaction-controls/transaction-controls.service';

@Component({
  selector: 'app-ip-blocking-status',
  templateUrl: './ip-blocking-status.component.html',
  styleUrls: ['./ip-blocking-status.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IpBlockingStatusComponent implements OnInit, OnChanges {
  public ipBlockingStatusForm: FormGroup;
  @Input() disableForms:any 
  @Input() lockingDetails : any;
  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _userConfigService: UserConfigService,
    private readonly _transactionControlsService: TransactionControlsService,
    private readonly _snackBar: MatSnackBar,
  ) { }
  ngOnChanges(): void {
      this.ipBlockingStatusForm.disable();
  }

  ngOnInit(): void {
    this.createIpBlockingForm();
  }
  createIpBlockingForm(): void {
    this.ipBlockingStatusForm = this._formBuilder.group({
      IsActive: [this.lockingDetails.IsActive, Validators.required],
      FraudType: [2, Validators.required],
    })
  }
  ipBlockingStatus(): any {
     if(this.ipBlockingStatusForm.valid) {
      const checkForUserRole = this._userConfigService.getUserMode();
      const roleObject = (checkForUserRole) ? checkForUserRole : { EntityId: 0, UserRoleId: 1 }
      const obj = {
        ...this.ipBlockingStatusForm.value,
        ...roleObject
      }
      this._transactionControlsService.ipBlockingStatus(obj).then((res:any)=>{
        if (res && !res.StatusCode) { 
          this._snackBar.open('Ip Blocking status set Successfully!', '', globalConfig.snackBarConfig);
          this.ipBlockingStatusForm.controls['IsActive'].reset();
        }
      })
     } else {
         
     }
  }
}
