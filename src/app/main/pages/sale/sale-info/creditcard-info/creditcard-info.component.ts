import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { StripeElementsOptions } from '@stripe/stripe-js';
import { StripeCardNumberComponent, StripeService } from 'ngx-stripe';
import { SaleService } from '../../sale.service';
import { snackBarConfig, snackBarConfigWarn, validateAllFormFields } from 'constants/globalFunctions';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-creditcard-info',
  templateUrl: './creditcard-info.component.html',
  styleUrls: ['./creditcard-info.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations

})
export class CreditcardInfoComponent implements OnInit {
  @ViewChild(StripeCardNumberComponent) card: StripeCardNumberComponent;
  @Input() data: any;
  @Input() requiredFields: any;
  @Input() personalInfoFormValidation: FormGroup;
  @Output() resetCreditCard = new EventEmitter<any>();
  public process: boolean = false;
  public elementsOptions: StripeElementsOptions = {
    locale: 'en',
  };
  public cardOptions: any = {
    showIcon: true,
    style: {
      base: {
        'color': '#32325D',
        'fontWeight': '400',
        'fontFamily': 'Muli, Helvetica Neue, Arial, sans-serif',
        'fontSize': '15px',
        'fontSmoothing': 'antialiased',

        '::placeholder': {
          color: '#00000099',
        },
        ':-webkit-autofill': {
          color: '#e39f48',
        },
      },
      invalid: {
        'color': '#E25950',

        '::placeholder': {
          color: '#FFCCA5',
        },
      },

    }
  };
  public cardOptionsCVC: any = {
    ...this.cardOptions,
    placeholder: 'CVV / CVC2 / CVV2 / CID'
  };
  public creditcardForm: FormGroup;

  /**
       * Constructor
       *
       * @param {SaleService} _saleService
       * @param {StripeService} _stripeService
       * @param {MatSnackBar} _snackBar
       * @param {Router} _router
       */

  constructor(
    private readonly _saleService: SaleService,
    private readonly _formBuilder: FormBuilder,
    private readonly _stripeService: StripeService,
    private readonly _snackBar: MatSnackBar
  ) { }
  ngOnInit(): void {
    this.creditcardForm = this._formBuilder.group({
      CardholderName: [''],
      Address: [''],
      ZipCode: [''],
      TransactionType: [1, Validators.required]
    });
    if (this.requiredFields) {
      this.applyValidation();
    }
  }
  applyValidation() {
    if (this.requiredFields && Object.keys(this.requiredFields).length) {
      for (const key in this.requiredFields) {
        if (this.creditcardForm.value.hasOwnProperty(key)) {
          if (this.requiredFields[key]) {
            this.creditcardForm.get(key).setValidators([Validators.required]);
          } else {
            this.creditcardForm.get(key).setValidators([]);
          }
          this.creditcardForm.get(key).updateValueAndValidity();
        }
      }
    }
  }
  cardUpdated(value) {
    console.log(value);
  }
  payNow() {
    this.process = true
    if (this.creditcardForm.valid && this.personalInfoFormValidation.valid) {
      this._stripeService.confirmCardPayment(this.data.SecretKey, {
        payment_method: {
          card: this.card.element
        }
      }).subscribe((result: any) => {
        if (result.error) {
          this._snackBar.open(result.error.message, '', snackBarConfigWarn);
          this.process = false;
          if(result.error.payment_intent) {
            if(result.error.payment_method) {
              this.transactionProcess(result.error.payment_intent, result.error.type);
            }
          }
        } else {
          this.transactionProcess(result.paymentIntent);
        }
      })
    } else {
      validateAllFormFields(this.creditcardForm);
      validateAllFormFields(this.personalInfoFormValidation);
    }
  }

  private transactionProcess(paymentIntent, type?) {
    const object = [{
      ...this.data,
      ...this.creditcardForm.value,
      Stripe: JSON.stringify(paymentIntent),
      Status: (type == 'card_error') ? 0 : 1,
    }]
    this._saleService.payTransaction(object)
      .then((res: any) => {
        if (res && !res.StatusCode) {
          this._snackBar.open(`${(!type) ? 'Transaction has been Approved' : 'Transaction has been Declined'}` , '',  (!type) ? snackBarConfig : snackBarConfigWarn);
          if(!type)
          this.resetCreditCard.emit(res.Response.shift());
          this.process = false;
        } else {
          this.process = false;
        }
      }).catch((err: HttpErrorResponse) => (console.log))
  }
}
