import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { validateAllFormFields, validator } from '../../../../../constants/globalFunctions';
import { SlidingPanelService } from '@fuse/components/sliding-panel/sliding-panel.service';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
@Component({
  selector: 'app-pricing-plan-form',
  templateUrl: './pricing-plan-form.component.html',
  styleUrls: ['./pricing-plan-form.component.scss']
})
export class PricingPlanFormComponent implements OnInit, OnChanges, AfterViewInit {

  public maxPercentage = validator.maxPercentage;
  public pricngPlanForm: FormGroup;
  @Output() submitForm = new EventEmitter<any>();
  @Input() pricingPlanDetail: any = null;
  public changesMade: boolean = true;
  @ViewChild('transactionFees') input;
  @ViewChild('ppName') input2;
  /**
   * Constructor
   * @param {MatDialog} _dialog
   *@param {SlidingPanelService} _slidingPanelService
   * @param {FormBuilder} _formBuilder
   */
  constructor(
    private _formBuilder: FormBuilder,
    private readonly _cdref: ChangeDetectorRef,
    private readonly _slidingPanelService: SlidingPanelService,
    private readonly _dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.createPricingPlanForm();
    this.pricngPlanForm.valueChanges.subscribe(val => {
      if (!this.pricingPlanDetail) {
        this.changesMade = false;
      }
    });
  }

  ngOnChanges() {
    if (this.pricingPlanDetail) {
      if (!this.pricngPlanForm) {
        this.createPricingPlanForm();
      }
      this.pricngPlanForm.patchValue(this.pricingPlanDetail)
    }
    this.pricngPlanForm.valueChanges.subscribe(val => {
      if (this.pricingPlanDetail) {
        this.changesMade = false;
      }
    });
  }
  ngAfterViewInit(): void {
    this._cdref.detectChanges();
    if (this.pricingPlanDetail) {
      this.pricngPlanForm.patchValue(this.pricingPlanDetail);
    }
  }
  createPricingPlanForm(): void {
    this.pricngPlanForm = this._formBuilder.group({
      PricingPlanID: [0, Validators.required],
      PricingTitle: ['', Validators.required],
      Description: ['', Validators.required],
      Reserve: [0, [Validators.required, Validators.max(this.maxPercentage)]],
      DiscountRate: [0, [Validators.required, Validators.max(this.maxPercentage)]],
      AuthFee: [0, Validators.required],
      ChargeBack: [35, Validators.required],
      RetrievalFee: [0, Validators.required],
      MonthlyMinimunFee: [0, Validators.required],
      MonthlyStatementFee: [0, Validators.required],
      ApplicationSetupFee: [0, Validators.required],
      WireTransferFee: [0, Validators.required],
      GateWaySetupFee: [0, Validators.required],
      GateWayMonthlyAccess: [0, Validators.required],
      PerTransactionFee: [0, Validators.required],
      PricingPlanType: [1, Validators.required],
      FeeAmount: [0, Validators.required],
      OtherFee: [0, Validators.required],
      TransactionFee: [0, [Validators.required, Validators.max(this.maxPercentage)]],
      VoidFee: [0]
    });
  }
  submit() {
    this.input.nativeElement.focus();
    this.input2.nativeElement.focus();

    if (this.pricngPlanForm.valid) {
      if (this.pricngPlanForm.controls['TransactionFee'].value <= 0) {
        this.pricngPlanForm.controls.TransactionFee.setErrors({
          transactionFeeZero: true
        })

        this.input.nativeElement.focus();

        return;
      }
      this.submitForm.emit(this.pricngPlanForm.value);
    } else {
      validateAllFormFields(this.pricngPlanForm)
    }
  }
  openDialog(): void {
    if (!this.changesMade) {
      const dialogRef = this._dialog.open(FuseConfirmDialogComponent, { width: '550px' });
      dialogRef.componentInstance.data = {
        title: "Confirmation",
        ...(!this.pricingPlanDetail) ? { message: "The data you have entered will be lost. Are you sure you want to cancel ?" } : { message: "The changes you have made will be lost. Are you sure you want to cancel ?" }
      }
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this._slidingPanelService.getSidebar('slidePanel', 'PricingPlanCreateComponent').toggleOpen();
        }
      })
    }
    else {
      this._slidingPanelService.getSidebar('slidePanel', 'PricingPlanCreateComponent').toggleOpen();
    }
  }
}