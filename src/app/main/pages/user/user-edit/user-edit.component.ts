import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SlidingPanelService } from '@fuse/components/sliding-panel/sliding-panel.service';
import { snackBarConfig, snackBarConfigWarn } from 'constants/globalFunctions';
import { Subject } from 'rxjs';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  public UserInfo: any = {};
  private _unsubscribeAll: Subject<any>;
  @Input() data: any;
  public panelChangesSubscriber: any;
/**
     * Constructor
     * @param {ChangeDetectorRef} _cdref
     */
  constructor(
    private _slidingPanelService:SlidingPanelService,
    private readonly _cdref: ChangeDetectorRef,
    private readonly _userService : UserService,
    private readonly _snackBar: MatSnackBar,
  ) { 
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this._cdref.detectChanges();
    this._unsubscribeAll
    if(this.data) {
      this.UserInfo = this.data;
    }
  }
  ngOnDestroy(): void{
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
   
  }
  
  updateUser(event){
 
      let obj = {
        ...this.UserInfo,
        ...event
      }
      this._userService.updateUser(obj).then((res: any) => { 
        if (res && !res.StatusCode) {
            this._snackBar.open('User updated successfully!', '', snackBarConfig);
            this._slidingPanelService.setSlidingPanelStatus("UpdateUser");
          
            
            this.closeSlidingPanel();
        } else{
          this._snackBar.open(res.StatusMessage, '', snackBarConfigWarn)
        }
      }).catch((err: HttpErrorResponse)=>(console.log))
  
  
  }
  closeSlidingPanel(): void {
    this._slidingPanelService.closeSlidingPanel('slidePanel').toggleOpen();
  }
}
