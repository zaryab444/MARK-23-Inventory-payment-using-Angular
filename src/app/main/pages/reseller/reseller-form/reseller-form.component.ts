import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { UserConfigService } from '@fuse/services/user.config.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as globalConfig from '../../../../../constants/globalFunctions';
import { PartnerService } from '../../partner/partner.service';
import { SlidingPanelService } from '@fuse/components/sliding-panel/sliding-panel.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { authRole } from '../../../../../constants/globalFunctions';
@Component({
  selector: 'app-reseller-form',
  templateUrl: './reseller-form.component.html',
  styleUrls: ['./reseller-form.component.scss']
})
export class ResellerFormComponent implements OnInit, OnDestroy, OnChanges {

  public resellerForm: FormGroup;
  public globalConfig = globalConfig;
  public partners: any = [];
  @Output() submitForm = new EventEmitter<any>();
  @Input() resellerDetail: any = null;
  private _unsubscribeAll: Subject<any>;
  public userType: number;
  public authRolePartner = authRole.partner;
  public changesMade: boolean = true;
  public btnclick:boolean;

    /**
     * Constructor
     *@param {MatDialog} _dialog
     * @param {FormBuilder} _formBuilder
     * @param {UserConfigService} _userConfigService
     * @param {PartnerService} _partnerService
     * @param {SlidingPanelService} _slidingPanelService
     * @param {Router} _router
     */
    constructor(
      private readonly _formBuilder: FormBuilder,
      private readonly _userConfigService: UserConfigService,
      private readonly _partnerService: PartnerService,
      private readonly _slidingPanelService: SlidingPanelService,
      private readonly _dialog: MatDialog,
      private readonly _router: Router

  ) { 
      // Set the private defaults
      this._unsubscribeAll = new Subject();
  }


  ngOnInit(): void {
    this._userConfigService.userModeChange
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(() => this.getPartners())
    this.createResellerForm()
    this.userType =   this._userConfigService.loggedInUser.UserRoleId;
    this.resellerForm.valueChanges.subscribe(val => {
      if (!this.resellerDetail) {
        this.changesMade = false;
      }
    });
   
 }


 ngOnDestroy(): void {
  // Unsubscribe from all subscriptions
  this._unsubscribeAll.next();
  this._unsubscribeAll.complete();
}

createResellerForm(): void {
  this.resellerForm = this._formBuilder.group({
    PartnerId: ['', Validators.required],
    ResellerId: [0, Validators.required],
    ResellerName: [{value:'' , disabled:this.resellerDetail}, [Validators.required ,Validators.maxLength(globalConfig.validator.maxFieldLength)]],
    DBAName: ['', Validators.maxLength(globalConfig.validator.maxFieldLength)],
    Country: ['', Validators.required],
    FirstName: ['',[ Validators.required, Validators.maxLength(globalConfig.validator.maxName)]],
    LastName: ['', [Validators.required, Validators.maxLength(globalConfig.validator.maxName)]],
    Address1: ['', Validators.required],
    City: ['', Validators.required],
    State: ['', Validators.required],
    Zip: ['', [Validators.required, Validators.maxLength(globalConfig.validator.zipMaxLength)]],
    Email: [{value:'', disabled:this.resellerDetail}, [Validators.required, Validators.email, Validators.pattern(globalConfig.validator.emailPattern)]],
    AlternateEmail: ['', [Validators.email, Validators.pattern(globalConfig.validator.emailPattern)]],
    TelephoneNumber: ['', Validators.required],
    TelephoneExt: [''],
    AlternativePhoneNumber: [''],
    AlternativePhoneExt: [''],
    Fax: [''],
    TaxId: [''],
  });

}

ngOnChanges(){
  if(this.resellerDetail){
    if(!this.resellerForm){
      this.createResellerForm()
    }
    this.resellerForm.patchValue(this.resellerDetail)
  }
  this.resellerForm.valueChanges.subscribe(val => {
    if (this.resellerDetail) {
      this.changesMade = false;
    }
  });
}

getPartners(): void{
  this._partnerService.partnerList(this._userConfigService.getUserMode())
  .then((res: any) => {
      if(res && !res.StatusCode){
          this.partners = res.Response.Partners;
          if(this.userType == authRole.partner){
            this.resellerForm.get('PartnerId').setValue(res.Response.Partners[0].PartnerId)
        } 
      }
  }).catch((err: HttpErrorResponse)=>(console.log))
  }


  openDialog(): void { 
    
    if (!this.changesMade) {
      const dialogRef = this._dialog.open(FuseConfirmDialogComponent, { width: '550px' });
      dialogRef.componentInstance.data = {
        title: "Confirmation",
        ...(!this.resellerDetail) ? { message: "The data you have entered will be lost. Are you sure you want to cancel ?" } : { message: "The changes you have made will be lost. Are you sure you want to cancel ?" }
      }
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          if (!this.resellerDetail) {
            this._slidingPanelService.getSidebar('slidePanel', 'ResellerCreateComponent').toggleOpen();
          }
          else {
            this._router.navigate(["/pages/reseller/reseller-list"])
          }
        }
      })
    }
    else {
      if (!this.resellerDetail) {

        this._slidingPanelService.getSidebar('slidePanel', 'ResellerCreateComponent').toggleOpen();
      }
      else {
        this._router.navigate(["/pages/reseller/reseller-list"])
      }
    }

  }


 submit(){
   if(this.resellerForm.valid){
    this.btnclick = true
    setTimeout(() => {
      this.btnclick = false;
          }, 3000);
     this.submitForm.emit({...this.resellerDetail, ...this.resellerForm.value});
   }else{
    globalConfig.validateAllFormFields(this.resellerForm)
   }
 }


}