import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as globalConfig from '../../../../../constants/globalFunctions';
import { SlidingPanelService } from '@fuse/components/sliding-panel/sliding-panel.service';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UserConfigService } from '@fuse/services/user.config.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  public userForm: FormGroup;
  public globalConfig = globalConfig;
  public currentUser;
  public changesMade: boolean = true;
  @Input() UserInfoDetail: any = null;
  @Output() submitForm = new EventEmitter<any>();
   /**
     * Constructor
     * @param {MatDialog} _dialog
     * @param {FormBuilder} _formBuilder,
     * @param {SlidingPanelService} _slidingPanelService
     */
  constructor(
    private readonly _formBuilder: FormBuilder,
    private _slidingPanelService:SlidingPanelService,
    private _userConfigService: UserConfigService,
    private readonly _dialog: MatDialog,
    
  ) { }

  ngOnInit(): void {
    this.currentUser =  this._userConfigService.loggedInUser;
    this.createUserForm();
    this.userForm.valueChanges.subscribe(val => {
      if (!this.UserInfoDetail) {
        this.changesMade = false;
      }
    
    });
  }


  ngOnChanges() {
    if (this.UserInfoDetail) {
      if (!this.userForm) {
        this.createUserForm();
      }
      this.userForm.patchValue(this.UserInfoDetail)
    }
    this.userForm.valueChanges.subscribe(val => {
      if (this.UserInfoDetail) {
        this.changesMade = false;
      }
    });
  }



  createUserForm(): void{
 
    this.userForm = this._formBuilder.group({
      FirstName: ['', [Validators.required,Validators.maxLength(globalConfig.validator.maxName)]],
      LastName: ['', [Validators.required , Validators.maxLength(globalConfig.validator.maxName)]],
      Username: ['', [ Validators.required , Validators.email, Validators.pattern(globalConfig.validator.emailPattern)]],
      Email:  ['', [Validators.required, Validators.email, Validators.pattern(globalConfig.validator.emailPattern)]],
      Phone: ['', Validators.required],
      IsActive: [true]
  });
  
  }
  closeSlidingPanel(): void {
    if (!this.changesMade) {
      const dialogRef = this._dialog.open(FuseConfirmDialogComponent, { width: '550px' });
      dialogRef.componentInstance.data = {
        title: "Confirmation",
        ...(!this.UserInfoDetail) ? { message: "The data you have entered will be lost. Are you sure you want to cancel ?" } : { message: "The changes you have made will be lost. Are you sure you want to cancel ?" }
      }
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this._slidingPanelService.closeSlidingPanel('slidePanel').toggleOpen();
        }
      })
    }
    else{
      this._slidingPanelService.closeSlidingPanel('slidePanel').toggleOpen();
    }
  
  }
submit(){
  
    this.submitForm.emit({...this.userForm.value});

  }
}


