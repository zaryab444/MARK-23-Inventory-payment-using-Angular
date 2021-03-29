import { SelectionModel } from '@angular/cdk/collections';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { snackBarConfig, snackBarConfigWarn } from 'constants/globalFunctions';
import { DisputesService } from '../../disputes.service';
import * as globalConfig from 'constants/globalFunctions';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-all-disputes-table',
  templateUrl: './all-disputes.component.html',
  styleUrls: ['./all-disputes.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations:fuseAnimations
})
export class AllDisputesTableComponent implements OnInit {
  public dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  public showReverse: boolean;
  public DisputeFee: any = 0;
  public DataDisputeFee: any;
  @Input() data: any;
  @Output() ExportCall = new EventEmitter<any>();
  public reverseForm: FormGroup;
  public dialogRef: any;
  @ViewChild('reverseDialog') reverseDialog: any;
  public actionControlOnHover = -1;

  public selection = new SelectionModel<any>(true, []);
  private selectedToReverse: any = {};
  public chargeCheck : boolean;
  public Amount : any ;
  public chargeValue : any;

  public displayedColumns: string[] = ['Dispute.amount','Info.MerchantUserName','Info.CardType','Dispute.reason','Dispute.created','Dispute.status','Action'];
  topDisputeFee: any;
  /**
     * Constructor
     * @param {UserConfigService} _userConfigService
     * @param {FormBuilder} _formBuilder
  */
  constructor(
    private readonly _DisputesService : DisputesService,
    private readonly _formBuilder: FormBuilder,
    private readonly _dialog: MatDialog,
    private readonly _snackBar: MatSnackBar,
  ) {   }

  ngOnInit(): void {
    if(this.data){
      this.dataSource.data = this.data.data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (data, sortHeaderId: string) => {
        return this.getPropertyByPath(data, sortHeaderId);
      };
    }
  }
  getPropertyByPath(obj: Object, pathString: string) {
    return pathString.split(".").reduce((o, i) => o[i], obj);
  }
  createReverseForm() {
    this.reverseForm = this._formBuilder.group({
      TransactionId: [(this.selectedToReverse.Info.TransactionId)],
      Amount: [this.selectedToReverse.Info.RemainingAmount, Validators.required],
      MerchantId: [this.selectedToReverse.Info.MerchantId],
      ChargeDisputeFee : [true],
      DisputeFee:[this.selectedToReverse.Info.ChargeBackFee]
    });
  }
  openReverseDialog(val?,btn?) {
    (btn)?this.selectedToReverse = val:'';
    this.createReverseForm();
    this.topDisputeFee = val.Info.ChargeBackFee
    this.DisputeFee = this.selectedToReverse.Info.ChargeBackFee
    this.dialogRef = this._dialog.open(this.reverseDialog, { width: '600px' });
    this.dialogRef.afterClosed().subscribe(res => {
      if (res) {
          // res here
          this._DisputesService.updatetable(true);
      }
    })
  }
  
  showDisputeAmount(){

    if(!this.reverseForm.value.ChargeDisputeFee){
        this.topDisputeFee =  this.selectedToReverse.Info.ChargeBackFee
    }else{
        this.topDisputeFee =  0.00
    }
  }

  reverse() {
    if (this.reverseForm.valid) {
      if (this.reverseForm.controls['Amount'].value && this.reverseForm.controls['Amount'].value > this.selectedToReverse.Amount) {
        this.reverseForm.controls.Amount.setErrors({
          amountExceed: true
        })
        return;
      }

      
      
      this._DisputesService.disputeReverse({ ...this.reverseForm.value})
        .then((res: any) => {
          if (res && !res.StatusCode) {
            this._snackBar.open('Amount reversed successfully', '', snackBarConfig);

            this.dialogRef.close(true);

          } else {
            this._snackBar.open(res.StatusMessage, '', snackBarConfigWarn);
            this.dialogRef.close();
          }

        }).catch((err: HttpErrorResponse) => (console.log));
    } else {
      globalConfig.validateAllFormFields(this.reverseForm)
    }
  }
  exportFile(value){
    let obj = {ExportType: value,'IsExport': true};
    this.ExportCall.emit(obj);
  }
}
