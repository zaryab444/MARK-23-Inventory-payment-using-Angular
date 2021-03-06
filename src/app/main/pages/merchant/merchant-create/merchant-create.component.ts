import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EmailDialogComponent } from '@fuse/components/email-dialog/email-dialog.component';
import { snackBarConfig, snackBarConfigWarn } from '../../../../../constants/globalFunctions';
import { MerchantService } from '../merchant.service';

@Component({
  selector: 'app-merchant-create',
  templateUrl: './merchant-create.component.html',
  styleUrls: ['./merchant-create.component.scss']
})
export class MerchantCreateComponent implements OnInit {
public onBoardError: string = undefined;
 /**
     * Constructor
     *
     * @param {MerchantService} _merchantService
     * @param {MatSnackBar} _snackBar
     * @param {Router} _router
     */
  constructor(
    private readonly _merchantService: MerchantService,
    private readonly _snackBar: MatSnackBar,
    private readonly _router: Router,
    private readonly _dialog: MatDialog
  )
  {}

  ngOnInit(): void {
  }

  createMerchant(event: any): void{
    this.onBoardError = undefined;
    this._merchantService.saveMerchant(event)
    .then((res: any) => {
      if(res && !res.StatusCode){
        this._snackBar.open('Merchant created', '', snackBarConfig);
        this.openDialog(res.Response);        
      }else{
        this.onBoardError = (res.Response)? `${res.StatusMessage}: ${res.Response}`: res.StatusMessage;
        this._snackBar.open(this.onBoardError, '', snackBarConfigWarn)
      }
  }).catch((err: HttpErrorResponse)=>(console.log))
  }
  openDialog(obj) {
    const object:any = {
      SendTo: obj.MerchantAccountSetup.MerchantEmail,
      Subject: obj.EmailSubject,
      BodyContent: obj.EmailBody,
      MerchantName: `${obj.FirstName} ${obj.LastName}`,
      PartnerId: obj.PartnerId,
      MerchantId:obj.MerchantId
      
    }
    const dialogRef = this._dialog.open(EmailDialogComponent, {width: '660px'});
    dialogRef.componentInstance.data = object;
    dialogRef.afterClosed().subscribe(()=>this._router.navigate(['/pages/merchant/merchant-list']))
  }
}
