import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EmailDialogComponent } from '@fuse/components/email-dialog/email-dialog.component';
import { snackBarConfig, snackBarConfigWarn } from '../../../../../constants/globalFunctions';
import { SettingService } from '../../settings/settings.service';

@Component({
  selector: 'app-plg-create',
  templateUrl: './plg-create.component.html',
  styleUrls: ['./plg-create.component.scss']
})
export class PlgCreateComponent implements OnInit {
  public onBoardError: string = undefined;
  /**
      * Constructor
      *
      * @param {SettingService} _settingService
      * @param {MatSnackBar} _snackBar
      * @param {Router} _router
      */
  constructor(
    private readonly _settingService: SettingService,
    private readonly _snackBar: MatSnackBar,
    private readonly _router: Router
  ) { }

  ngOnInit(): void {
  }

  createPlg(event: any): void {
    this._settingService.plgManager(event)
      .then((res: any) => {
        if (res && !res.StatusCode) {
          window.localStorage.removeItem('ThemeSettings');
          localStorage.setItem('ThemeSettings', JSON.stringify(res.Response[0]));
          this._snackBar.open('Theme settings has been saved successfully!', '', snackBarConfig);
          this._router.navigate(['/pages/plg-management']);
        } else {
          this._snackBar.open( `${res.StatusMessage}`, '', snackBarConfigWarn)
        }
      }).catch((err: HttpErrorResponse) => (console.log))
  }
}


