import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SlidingPanelService } from '@fuse/components/sliding-panel/sliding-panel.service';
import { snackBarConfig, snackBarConfigWarn } from 'constants/globalFunctions';
import { UserService } from '../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { UserConfigService } from '@fuse/services/user.config.service';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent implements OnInit {

  @Input() data: any;
 
     /**
     * Constructor
     * @param {SlidingPanelService} _slidingPanelService
     * @param {UserService} _userService
     * @param {MatSnackBar} _snackBar
     * * @param {UserConfigService} _userConfigService
     */
  constructor(
    private _slidingPanelService:SlidingPanelService,
    private readonly _userService : UserService,
    private readonly _snackBar: MatSnackBar,
    private readonly _userConfigService: UserConfigService,
  ) { }

  ngOnInit(): void {
  }
  createUser(value){
    let idObj = {}
    
      if(this.data.hasOwnProperty('PartnerId')){
        idObj = {
            EntityID: this.data.PartnerId,
        UserRoleID :3 }
      }
      else if(this.data.hasOwnProperty('ResellerId')){
        idObj = {
            EntityID: this.data.ResellerId,
            UserRoleID :4 
        }
          }
    
    const obj = {
      ...value,
      ...this.data,
      ...idObj
      
      }
    this._userService.saveUser(obj)
    .then((res: any) => {
      if(res && !res.StatusCode){
        this._snackBar.open('User created', '', snackBarConfig);
        this._slidingPanelService.setSlidingPanelStatus("CreateUser");
        this.closeSlidingPanel();

      }else{
        this._snackBar.open(res.StatusMessage, '', snackBarConfigWarn);
      }
  }).catch((err: HttpErrorResponse)=>(console.log))
  
  }
  closeSlidingPanel(): void {
    this._slidingPanelService.closeSlidingPanel('slidePanel').toggleOpen();
  }

}
