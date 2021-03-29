import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { transactionStatus, transactionType } from '../../../../../constants/globalFunctions';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { TransactionService } from '../transaction.service';
import { ReceiptDialogComponent } from '@fuse/components/receipt-dialog/receipt-dialog.component';
import { EmailDialogComponent } from '@fuse/components/email-dialog/email-dialog.component';
import { MatMenu } from '@angular/material/menu';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.scss']
})
export class TransactionDetailComponent implements OnInit {
  public transType = transactionType;
  public transStatus = transactionStatus;
  public transactionDetail: any = {};
  private _unsubscribeAll: Subject<any>;
  public dialogRef: any;
  /**
  * Constructor
  *
  * @param {TransactionService} _transactionService
  * @param {ActivatedRoute} _route
  * @param {MatSnackBar} _snackBar
  * @param {Router} _router
  */
  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _transactionService: TransactionService,
    private readonly _dialog: MatDialog,
  ) { }

  ngOnInit() {
    this._route.paramMap
      .pipe(
        map((param) => param.get('id')),
        switchMap((id) =>
          this._transactionService.getTransactionDetail(id)
        ),
        tap((res: any) => (this.transactionDetail = res.Response)),
      )
      .subscribe();
  }

  printReceipt(obj) {
    const dialogRef = this._dialog.open(ReceiptDialogComponent, { width: '400px' });
    dialogRef.componentInstance.data = obj;
  }

  openemailDialog(obj) {
    const dialogRef = this._dialog.open(EmailDialogComponent, {width: '550px'});
    obj.isSingleInput = true
    dialogRef.componentInstance.data = obj ;

   }
   checkFor(value) {
    if (value) {
      if (this.transType.ACHDebit == value) {
        return value;
      } else if (this.transType.ACHRefund == value) {
        return value
      } else if (this.transType.ACHVoid == value) {
        return value;
      } else {
        return -1;
      }
    } else {
      return -1;
    }
  }
  Type(value) {
    if(value == 1) {
    return 'Checking';
    } else if(value == 2) {
      return 'Saving';
    }
   }
  print() {    
    window.print();
  }
   
}
