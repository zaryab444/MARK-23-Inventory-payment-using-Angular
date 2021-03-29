import { SelectionModel } from '@angular/cdk/collections';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { transactionType, transactionStatus, snackBarConfig, snackBarConfigWarn, dateFormat } from '../../../../../constants/globalFunctions';
import { TransactionService } from '../transaction.service';
import * as globalConfig from '../../../../../constants/globalFunctions';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ReceiptDialogComponent } from '@fuse/components/receipt-dialog/receipt-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EmailDialogComponent } from '@fuse/components/email-dialog/email-dialog.component';
import { UserConfigService } from '@fuse/services/user.config.service';
import { Router } from '@angular/router';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'app-transaction-table',
  templateUrl: './transaction-table.component.html',
  styleUrls: ['./transaction-table.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: 'auto', minHeight: '48px', visibility: 'visible', width: '100%', 'border-bottom': '1px solid #ccc' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ]),
    trigger('detailExpandRefund', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    fuseAnimations,
  ]
})
export class TransactionTableComponent implements OnInit, AfterViewInit {

  public isRefunded: boolean = true;
  public expandedRefundDetail: any;
  public transStatus = transactionStatus;
  public transType = transactionType;
  public dateFormat = dateFormat;
  public refundForm: FormGroup;
  public voidForm: FormGroup;
  public selection = new SelectionModel<any>(true, []);
  public showRefund: boolean;
  public selectedToRefund: any = {};
  public dialogRef: any;
  public recordCount: number = 0;
  @Input() data: any;
  @Input() dateRange: any
  toppingList = ['AccountType', 'AccountNumber', 'AccountHolderName', 'CardholderName', 'CardType', 'MerchantName', 'AuthCode', 'Bin', 'AVSDetail', 'EntryType', 'Last4digit', 'StatusCode', 'StatusMessage', 'TransactionId', 'TransactionType', 'CustomerEmail', 'AppId', 'ProfileId', 'Currency', 'Country', 'ZipCode', 'City', 'State', 'Address', 'LocationId', 'LocationName', 'ProcessorType', 'MerchantId', 'OriginalChargeID', 'OriginalPaymentID', 'ConnectedAccountID', 'InsertedOn'];
  statusList = [
    {
      Key: 'Approved',
      Value: 0
    },
    {
      Key: 'Decline',
      Value: 1
    },
    {
      Key: 'Pending',
      Value: 2
    }
  ];
  public AccountType = false;
  public AccountNumber = false;
  public AccountHolderName = false;
  public CardholderName = false;
  public CardType = false;
  public MerchantName = false;
  public AuthCode = false;
  public Bin = false;
  public AVSDetail = false;
  public EntryType = false;
  public Type = false;
  public DocNo = false;
  public Last4digit = false;
  public StatusCode = false;
  public StatusMessage = false;
  public TransactionId = false;
  public TransactionType = false;
  public CustomerEmail = false;
  public AppId = false;
  public ProfileId = false;
  public Currency = false;
  public Country = false;
  public ZipCode = false;
  public City = false;
  public State = false;
  public Address = false;
  public LocationId = false;
  public LocationName = false;
  public ProcessorType = false;
  public MerchantId = false;
  public OriginalChargeID = false;
  public OriginalPaymentID = false;
  public ConnectedAccountID = false;
  public InsertedOn = false;
  public allSelected = false;
  public expandedRowDetail: any;
  @ViewChild('mySel') skillSel: MatSelect;
  @ViewChild('refundDialog') refundDialog: any;
  @ViewChild('voidDialog') voidDialog: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  public dataSource = new MatTableDataSource<any>();
  @Output() updateList = new EventEmitter<boolean>();
  @Output() statusChanges = new EventEmitter<any>();
  public actionControlOnHover = -1;
  private columnstoDisplay: string[] = [
    'Icon',
    'Select',
    'TransactionId',
    'TransactionType',
    'InsertedOn',
    'Amount',
    'MerchantName',
    'Status',
    'CardholderName',
    'iconExpCol'
  ];
  public RefundDisplayedColumns: string[] = [
    'TransactionId',
    'TransactionType',
    'Amount',
    'status',
    'InsertedOn',
    'Action'
  ];
  public selectedElements = [
    'Type',
    'Last4digit',
    'EntryType',
    'AVSDetail',
    'AuthCode',
    'CardType'

  ]
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  public displayedColumns: string[] = this.columnstoDisplay.slice();
  isVoidExceed: boolean;
  isVoided: boolean;
  constructor(
    private readonly _dialog: MatDialog,
    private readonly _formBuilder: FormBuilder,
    private readonly _transactionService: TransactionService,
    private readonly _snackBar: MatSnackBar,
    private readonly _userConfigService: UserConfigService,
    public router: Router,

  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.dataSource.data = this.data.transaction;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      if (this.data.hideCol && this.displayedColumns.length) {
        this.displayedColumns = this.displayedColumns.slice(2);
      }

    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.recordCount = this.data.transactionCount, 0);
  }

  masterToggle() {
    this.showRefund = false;
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    //const numRows = this.dataSource.data.;
    //return numSelected == numRows.length;
    return numSelected;
  }
  selectRefundElement(value) {
    if (this.selection.selected.length == 1 && this.selection.hasValue()) {
      this.selectedToRefund = value;
      this.showRefund = true;
    } else {
      this.showRefund = false;
    }
  }
  openRefundDialog() {
    this.createRefundForm();
    this.dialogRef = this._dialog.open(this.refundDialog, { width: '600px' });
    this.dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.updateList.emit(true)
      }
    })
  }

  //   openvoidDialog() {
  //     this.createvoidForm();
  //     this.dialogRef = this._dialog.open(this.voidDialog, { width: '600px' });
  //     this.dialogRef.afterClosed().subscribe(res => {
  //       if (res) {
  //         this.updateList.emit(true)
  //       }
  //     })
  //   }

  confirmVoidDialog(obj): void {
    const dialogRef = this._dialog.open(FuseConfirmDialogComponent, { width: '550px' });
    dialogRef.componentInstance.data = {
      title: "Void Transaction",
      message: "Are you sure you want to void this transaction?"
    }
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (obj.TransactionType == 6) {
          this.voidACHTransaction(obj);
        } else {
          this.voidTransaction(obj);
        }


      }
    })

  }

  createvoidForm() {
    this.voidForm = this._formBuilder.group({
      TransactionId: [this.selectedToRefund.TransactionId, Validators.required],
      Amount: [{ value: this.selectedToRefund.Amount, disabled: this.selectedToRefund.Amount }, Validators.required],
      MerchantId: [this.selectedToRefund.MerchantId],
      Reason: ['requested_by_customer', Validators.required],
    });
  }

  voidTransaction(obj) {
    this.isVoided = false;
    this._transactionService.voidTransaction({ TransactionId: obj.TransactionId, MerchantId: obj.MerchantId })
      .then((res: any) => {

        if (res && !res.StatusCode) {

          this._snackBar.open('Amount Voided successfully', '', snackBarConfig);
          this.updateList.emit(true)
          this.dialogRef.close(true);



        } else {
          this._snackBar.open(res.StatusMessage, '', snackBarConfigWarn);
          this.dialogRef.close();
        }
        this.isVoided = true;
      }).catch((err: HttpErrorResponse) => (console.log));
  }


  voidACHTransaction(obj) {
    this.isVoided = false;
    this._transactionService.voidACHTransaction({ TransactionId: obj.TransactionId, MerchantId: obj.MerchantId })
      .then((res: any) => {

        if (res && !res.StatusCode) {

          this._snackBar.open('Amount Voided successfully', '', snackBarConfig);
          this.updateList.emit(true)
          this.dialogRef.close(true);



        } else {
          this._snackBar.open(res.StatusMessage, '', snackBarConfigWarn);
          this.dialogRef.close();
        }
        this.isVoided = true;
      }).catch((err: HttpErrorResponse) => (console.log));
  }

  changePage(event) {

    const obj = {
      ...this.dateRange,
      RecordLimit: event.pageSize,
      PageNo: ++event.pageIndex,
      ...this._userConfigService.getUserMode(),
      ...this.data.searchParms
    };
    this._transactionService.updateindexing(obj);
    this._transactionService.transactionList(obj)
      .then((res: any) => {
        if (res && !res.StatusCode) {
          if (res.Response &&
            res.Response.Transactions &&
            res.Response.Transactions.length) {
            this.dataSource.data = res.Response.Transactions;
          }
        }
      }).catch(() => (console.log))

  }
  createRefundForm() {
    this.refundForm = this._formBuilder.group({
      TransactionId: [this.selectedToRefund.TransactionId, Validators.required],
      TransactionAmount: [{ value: this.selectedToRefund.Amount, disabled: this.selectedToRefund.Amount }, Validators.required],
      NetAmount: [{ value: this.selectedToRefund.RemainingAmount, disabled: (this.selectedToRefund.RemainingAmount) || (this.selectedToRefund.Amount) }, Validators.required],
      Amount: ['', Validators.required],
      Reason: ['requested_by_customer', Validators.required],
    });
  }
  openEmailDialog(obj) {
    const dialogRef = this._dialog.open(EmailDialogComponent, { width: '550px' });
    obj.isSingleInput = true
    dialogRef.componentInstance.data = obj;

  }
  refund() {

    if (this.refundForm.valid) {
      this.isRefunded = false;
      if (this.refundForm.controls['Amount'].value && this.refundForm.controls['Amount'].value > this.selectedToRefund.Amount) {
        this.refundForm.controls.Amount.setErrors({
          amountExceed: true
        })
        this.isRefunded = true;
        return;
      }
      this._transactionService.refundTransaction({ ...this.refundForm.value, TransactionAmount: this.selectedToRefund.Amount })
        .then((res: any) => {

          if (res && !res.StatusCode) {

            this._snackBar.open('Amount refunded successfully', '', snackBarConfig);
            this.dialogRef.close(true);

          } else {
            this._snackBar.open(res.StatusMessage, '', snackBarConfigWarn);
            this.dialogRef.close();
          }
          this.isRefunded = true;
        }).catch((err: HttpErrorResponse) => (console.log));
    } else {
      globalConfig.validateAllFormFields(this.refundForm)
    }
  }

  refundACH() {

    if (this.refundForm.valid) {
      this.isRefunded = false;
      if (this.refundForm.controls['Amount'].value && this.refundForm.controls['Amount'].value > this.selectedToRefund.Amount) {
        this.refundForm.controls.Amount.setErrors({
          amountExceed: true
        })
        this.isRefunded = true;
        return;
      }
      this._transactionService.refundACHTransaction({ ...this.refundForm.value, TransactionAmount: this.selectedToRefund.Amount })
        .then((res: any) => {

          if (res && !res.StatusCode) {

            this._snackBar.open('Amount refunded successfully', '', snackBarConfig);
            this.dialogRef.close(true);

          } else {
            this._snackBar.open(res.StatusMessage, '', snackBarConfigWarn);
            this.dialogRef.close();
          }
          this.isRefunded = true;
        }).catch((err: HttpErrorResponse) => (console.log));

      this.isRefunded = true;
    } else {
      globalConfig.validateAllFormFields(this.refundForm)
    }
  }
  printReceipt(obj) {

    const dialogRef = this._dialog.open(ReceiptDialogComponent, { width: '400px' });
    dialogRef.componentInstance.data = obj;
  }
  change(val) {
    switch (val.value) {
      case 'AccountType':
        this.AccountType = val._selected;
        break;
      case 'AccountNumber':
        this.AccountNumber = val._selected;
        break;
      case 'AccountHolderName':
        this.AccountHolderName = val._selected;
        break;
      case 'CardholderName':
        this.CardholderName = val._selected;
        break;
      case 'CardType':
        this.CardType = val._selected;
        break;
      case 'MerchantName':
        this.MerchantName = val._selected;
        break;
      case 'AuthCode':
        this.AuthCode = val._selected;
        break;
      case 'Bin':
        this.Bin = val._selected;
        break;
      case 'AVSDetail':
        this.AVSDetail = val._selected;
        break;
      case 'EntryType':
        this.EntryType = val._selected;
        break;
      case 'Last4digit':
        this.Last4digit = val._selected;
        break;
      case 'StatusCode':
        this.StatusCode = val._selected;
        break;
      case 'StatusMessage':
        this.StatusMessage = val._selected;
        break;
      case 'TransactionId':
        this.TransactionId = val._selected;
        break;
      case 'TransactionType':
        this.TransactionType = val._selected;
        break;
      case 'CustomerEmail':
        this.CustomerEmail = val._selected;
        break;
      case 'AppId':
        this.AppId = val._selected;
        break;
      case 'ProfileId':
        this.ProfileId = val._selected;
        break;
      case 'Currency':
        this.Currency = val._selected;
        break;
      case 'Country':
        this.Country = val._selected;
        break;
      case 'ZipCode':
        this.ZipCode = val._selected;
        break;
      case 'City':
        this.City = val._selected;
        break;
      case 'State':
        this.State = val._selected;
        break;
      case 'Address':
        this.Address = val._selected;
        break;
      case 'LocationId':
        this.LocationId = val._selected;
        break;
      case 'LocationName':
        this.LocationName = val._selected;
        break;
      case 'ProcessorType':
        this.ProcessorType = val._selected;
        break;
      case 'MerchantId':
        this.MerchantId = val._selected;
        break;
      case 'OriginalChargeID':
        this.OriginalChargeID = val._selected;
        break;
      case 'OriginalPaymentID':
        this.OriginalPaymentID = val._selected;
        break;
      case 'ConnectedAccountID':
        this.ConnectedAccountID = val._selected;
        break;
      case 'InsertedOn':
        this.InsertedOn = val._selected;
        break;

    }
  }
  statusChange(val) {
    if (val.value.length) {
      const obj = {
        Statuses: val.value
      }
      this.statusChanges.emit(obj)
    }
  }
  toggleAllSelection() {
    this.allSelected = !this.allSelected;  // to control select-unselect

    if (this.allSelected) {
      this.skillSel.options.forEach((item: MatOption) => item.select());
    } else {
      this.skillSel.options.forEach((item: MatOption) => { item.deselect() });
    }
    this.skillSel.close();
  }
  TypeCheck(value) {
    if (value == 1) {
      return 'Checking';
    } else if (value == 2) {
      return 'Saving';
    }
  }
}
