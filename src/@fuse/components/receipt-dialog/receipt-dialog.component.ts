import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { transactionStatus, transactionType } from '../../../constants/globalFunctions';
import { MatDialogRef } from '@angular/material/dialog';
import { _isNumberValue } from '@angular/cdk/coercion';

@Component({
  selector: 'app-receipt-dialog',
  templateUrl: './receipt-dialog.component.html',
  styleUrls: ['./receipt-dialog.component.scss']
})
export class ReceiptDialogComponent implements OnInit {
  public transType = transactionType;
  public transStatus = transactionStatus;
  public appInfo = environment;
  public reciptData :any 
  @Input() data: any
  constructor(
    public readonly _dialogRef: MatDialogRef<any>
  ) { }

  ngOnInit(): void {
   this.reciptData = this.data;
  }

  print() {
    window.print();
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
 
}
