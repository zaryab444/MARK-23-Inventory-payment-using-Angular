import { Component, Input, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserConfigService } from '@fuse/services/user.config.service';
import * as globalConfig from '../../../../../../constants/globalFunctions';
import { TransactionControlsService } from '../../transaction-controls/transaction-controls.service';

@Component({
  selector: 'app-lock-controls',
  templateUrl: './lock-controls.component.html',
  styleUrls: ['./lock-controls.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LockControlsComponent implements OnInit {
  public lockControlForm: FormGroup;
  @Input() lockingDetails:any
  @Input() disableForms:any
    currentUser: any;
  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _userConfigService: UserConfigService,
    private readonly _transactionControlsService: TransactionControlsService,
    private readonly _snackBar: MatSnackBar,
  ) { } 
  ngOnInit(): void {
    this.currentUser =  this._userConfigService.loggedInUser;
    this.createLockControlForm();
    if(this.disableForms && this.currentUser.UserRoleId == 2) {
      this.lockControlForm.disable();
    }
  }
 
  createLockControlForm(): void {
    this.lockControlForm = this._formBuilder.group({
     
      IsActive: [false, Validators.required],
      FraudTypeId: [1, Validators.required],
    })
    if(this.lockingDetails && this.lockingDetails.hasOwnProperty('IsActive') ) {
        this.lockControlForm.patchValue(this.lockingDetails);
      }
  }
  lockSettings(): any {
    if (this.lockControlForm.valid) {
      const UserRole = this._userConfigService.getUserMode();

      if(this.lockingDetails && this.lockingDetails.hasOwnProperty('IsActive')) {
      this.lockingDetails.IsActive = this.lockControlForm.value.IsActive; 
      }

      let obj = {
        ...this.lockControlForm.value,
        ...UserRole,
      }
      if(this.lockingDetails) {
        obj =  {...obj, ...this.lockingDetails}
      }
    this._transactionControlsService.lockControls(obj).then((res:any)=>{
      if (res && !res.StatusCode) { 
        this._snackBar.open('Settings have been saved successfully', '', globalConfig.snackBarConfig);
    //    this.lockControlForm.controls['IsActive'].reset();
      }
    })
    } else  {

    }
  }
}
