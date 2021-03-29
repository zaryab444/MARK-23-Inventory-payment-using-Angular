import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { snackBarConfig, snackBarConfigWarn, validateAllFormFields } from 'constants/globalFunctions';
import { StripeService } from 'ngx-stripe';
import { SaleService } from '../../sale.service';

@Component({
  selector: 'app-ach-info',
  templateUrl: './ach-info.component.html',
  styleUrls: ['./ach-info.component.scss'],
  animations   : fuseAnimations
})
export class AchInfoComponent implements OnInit {
  
  @Input() data: any;
  @Input() personalInfoFormValidation: FormGroup;
  @Output() achResponse = new EventEmitter<any>();
  public achForm: FormGroup
  public process: boolean = false;
    /**
       * Constructor
       *
       * @param {MatSnackBar} _snackBar
       * @param {Router} _router
       */

  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _snackBar: MatSnackBar,
    private readonly _saleService: SaleService
  ) { }

  ngOnInit() {
    this.achForm = this._formBuilder.group({
      AccountHolderName: ['', Validators.required],
      AccountHolderType: ['', Validators.required],
      RoutingNumber:['', Validators.required],
      AccountNumber: ['', Validators.required]
    });
  }
  payNow() {
   if(this.achForm.valid) {
    this.process = true;
     this.transactionProcess(this.achForm.value);
   } else {
     this.process = false;
     validateAllFormFields(this.achForm);
   }
  }

  private transactionProcess(value) {
    const object = {
      ...this.data,
      ACHInfo: {...value}
    }
    this._saleService.AchTransaction(object)
      .then((res: any) => {
        if (res && !res.StatusCode) {
          this._snackBar.open('Transaction has been Approved', '', snackBarConfig);
          this.process = false;
          this.achResponse.emit(res.Response)
        } else {
          this.process = false;
          this._snackBar.open( `${res.StatusMessage}`, '', snackBarConfigWarn);
        }
      }).catch((err: HttpErrorResponse) => (console.log))
  }

}
