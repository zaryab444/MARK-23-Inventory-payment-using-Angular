import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { snackBarConfig, snackBarConfigWarn } from '../../../../../constants/globalFunctions';
import { Subject } from 'rxjs';
import { takeUntil, map, switchMap, tap } from 'rxjs/operators';
import { SettingService } from '../../settings/settings.service';
import { UserConfigService } from '@fuse/services/user.config.service';

@Component({
  selector: 'app-plg-edit',
  templateUrl: './plg-edit.component.html',
  styleUrls: ['./plg-edit.component.scss']
})
export class PlgEditComponent implements OnInit, OnDestroy {
  public onBoardError: string = undefined;
  public plgDetails: any = {};
  private _unsubscribeAll: Subject<any>;
 /**
     * Constructor
     *
     * @param {SettingService} _settingService
     * @param {ActivatedRoute} _route
     * @param {MatSnackBar} _snackBar
     * @param {Router} _router
     */
  constructor(
    private readonly _route : ActivatedRoute,
    private readonly _settingService: SettingService,
    private readonly _snackBar: MatSnackBar,
    private readonly _router: Router,
    private readonly _cdref: ChangeDetectorRef,
    private readonly _userConfigService: UserConfigService,
  )
  { 
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this._cdref.detectChanges();
    this._route.paramMap
    .pipe(
      takeUntil(this._unsubscribeAll),
      map((param) => param.get('id')),
      switchMap((id) =>
        this._settingService.getPlgManager({id:id})
      ),
      tap((res: any) => {
        this.plgDetails = res.Response.pop();
      }),
    )
    .subscribe();

  }
  ngOnDestroy(): void{
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  updatePlg(event: any): void{
    this.onBoardError = undefined;
    this._settingService.plgManager(event)
    .then((res: any) => {
      if(res && !res.StatusCode){
        this._snackBar.open('Theme updated', '', snackBarConfig);
        const themeSettings = JSON.parse(localStorage.getItem('ThemeSettings'));
        const userInfo = this._userConfigService.getUserMode();
        if(userInfo.UserRoleId != 1) {
          localStorage.removeItem('defaultThemeColor');
          localStorage.setItem('defaultThemeColor', JSON.stringify(themeSettings.colorTheme));
          localStorage.removeItem('defaultThemeLayout');
          localStorage.setItem('defaultThemeLayout', JSON.stringify(event.layout));

        } 
        // localStorage.removeItem('defaultThemeColor');

        this._router.navigate(['/pages/plg-management']);
      }else{
        this.onBoardError = (res.Response)? `${res.StatusMessage}: ${res.Response}`: res.StatusMessage;
        this._snackBar.open(this.onBoardError, '', snackBarConfigWarn);
      }
  }).catch((err: HttpErrorResponse)=>(console.log))
  }
}
