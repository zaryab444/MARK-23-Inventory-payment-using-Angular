import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UserConfigService } from '@fuse/services/user.config.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DisputesService } from './disputes.service';
import { MatDatepicker } from '@angular/material/datepicker/datepicker';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-disputes',
  templateUrl: './disputes.component.html',
  styleUrls: ['./disputes.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DisputesComponent implements OnInit {
  
 
  public isAdmin : boolean = false;
  private _unsubscribeAll: Subject<any>;
    AllDispute: any;
    LostDispute: any;
    WonDispute: any;
    data: any;
   
  constructor(
      private _userConfigService : UserConfigService,
      private readonly _DisputesService : DisputesService,
      private readonly _formBuilder: FormBuilder,
  ) { 

    this._unsubscribeAll = new Subject();
  }
  

  ngOnInit(): void {
    this._userConfigService.userModeChange
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(() =>  this.checkUser());
    
  

  }
  

  checkUser(){
    const user = this._userConfigService.getUserMode();
    if(user == null ){
        this.isAdmin = true
    }
    else if (user.hasOwnProperty('PartnerId')){
        this.isAdmin = true
    }
    else if (user.hasOwnProperty('UserRoleId')){
        if(user.UserRoleId == 1)
        {
            this.isAdmin = true
        }
        else{
            this.isAdmin = false
        }
            }
    else
    {
        this.isAdmin = false
    }

  }
  





}
