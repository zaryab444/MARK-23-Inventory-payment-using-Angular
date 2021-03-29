import { Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, ElementRef, EventEmitter, OnInit, Output, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { UserConfigService } from '@fuse/services/user.config.service';
import { TransactionTableComponent } from '../transaction-table/transaction-table.component';
import { TransactionService } from '../transaction.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NoFoundComponent } from '@fuse/components/no-found/no-found.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker/datepicker';
import { AdvancedSearchComponent } from '@fuse/components/advanced-search/advanced-search.component';
import { transactionStatus, transactionType } from 'constants/globalFunctions';
import { parseInt } from 'lodash';
@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TransactionListComponent implements OnInit {
  @ViewChild('renderingContainer', { read: ViewContainerRef }) container: ViewContainerRef;

  @ViewChild('picker') datePicker: MatDatepicker<any>;
  @ViewChild('datepickerFooter', {static: false}) datepickerFooter: ElementRef;
  public transStatus = transactionStatus ;
  public transType = transactionType
  public transactionSearch: any[] = [];
  
  private componentRef: ComponentRef<any>;
  private _unsubscribeAll: Subject<any>;
  public transactionType: any = {};
  dateRangeForm: FormGroup;
  dateTo = moment().format('YYYY-MM-DD');
  dateFrom = moment().subtract(15, 'd').format('YYYY-MM-DD');
  public panelChangesSubscriber: any;
  public ranges: Array<{key: string, label: string}> = [
    {key: 'today', label: 'Today'},
    {key: 'yesterday', label: 'Yesterday'},
    {key: 'thisweek', label: 'This Week'},
    {key: 'lastweek', label: 'Last Week'},
    {key: 'thismonth', label: 'This Month'},
    {key: 'lastmonth', label: 'Last Month'},
    {key: 'last60', label: 'Last 60 Days'},
    {key: 'last90', label: 'Last 90 Days'},
    {key: 'thisyear', label: 'This Year'},
];
dateToFooter = moment();
dateFromFooter = moment();
 public searchObject = {};

  /**
     * Constructor
     *
     * @param {UserConfigService} _userConfigService
     * @param {TransactionService} _transactionService
     * @param {ComponentFactoryResolver} _resolver
     */
  constructor(
    private readonly _transactionService: TransactionService,
    private readonly _userConfigService: UserConfigService,
    private readonly _resolver: ComponentFactoryResolver,
    private readonly _formBuilder: FormBuilder,
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }


  

  ngOnInit() {
    this.serchingTransaction();
    this.rangeForm();
    this._userConfigService.userModeChange
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => this.getTransaction())
      this.panelChangesSubscriber = this._transactionService.panelChange.subscribe((res: any) => {
      
        if (res) {
          
          // this.getDisputes();
        }
      })
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
    this.componentRef && this.componentRef.destroy();
  }

  renderingComponent(type, data?) {
    
    const factory: ComponentFactory<any> = this._resolver.resolveComponentFactory(type);
    this.container.clear();
    this.componentRef = this.container.createComponent(factory);
    this.componentRef.instance.data = data;
    this.componentRef.instance.dateRange = { FromDate:moment(this.dateRangeForm.value.FromDate).format("MM-DD-YYYY"), ToDate: moment(this.dateRangeForm.value.ToDate).format("MM-DD-YYYY")}
    this.componentRef.instance.updateList.subscribe(res => {
      if (res) {
        this.getTransaction();
      }
    });
    this.componentRef.instance.statusChanges.subscribe(res => {
      if (res) {
        this.getTransaction(res);
      }
    });
  }

  getTransaction(val?): void {
    let obj;
    this.dateRangeForm.value.FromDate = moment(this.dateRangeForm.value.FromDate).format("MM-DD-YYYY");
     this.dateRangeForm.value.ToDate= moment(this.dateRangeForm.value.ToDate).format("MM-DD-YYYY");
if(val?.IsExport){
    
  obj= {
    ...this._userConfigService.getUserMode(), 
    ...val,
    ...this.dateRangeForm.value,
    }
}
else{
     obj = {
       ...this.dateRangeForm.value,
       ...this._userConfigService.getUserMode(),
       RecordLimit: 100,
       PageNo: 1,
       ...val
   }
  }

   this._transactionService.transactionList(obj)
     .then((res: any) => {
       if (res && !res.StatusCode) {
         this.transactionType = res.Response.TotalTransaction;
         if(res.Response.FileUrl){
          //FileSaver.saveAs(res.Response.FileUrl);
          let url = res.Response.FileUrl
          window.open(url, 'Download');  


        }
         if (res.Response && res.Response.Transactions.length) {
           this.renderingComponent(TransactionTableComponent, {
            transaction: res.Response.Transactions,
            transactionCount: res.Response.TotalTransactionCount,
            searchParms: this.searchObject 
           });
         } else {
           this.renderingComponent(NoFoundComponent, {
             icon: 'no-transaction',
             text: 'No Transaction(s) Found',
             subText: "You haven’t made any transaction"
           });
         }
       }
     }).catch(() => (console.log))
 }

 searchTrans(obj){
   this.searchObject = obj
   if(obj.hasOwnProperty('Status') || obj.hasOwnProperty('TransactionType')){
    if(obj.Status === 'All'){
        obj.Status = null
    }
    if(obj.TransactionType === 'All'){
      obj.TransactionType = null
    }
  }
if(obj.hasOwnProperty('Last4digit')){
  obj.Last4digit = parseInt(obj.Last4digit)
}
if(obj.hasOwnProperty('Amount')){
  obj.Amount = parseFloat(obj.Amount)
}

if(obj.hasOwnProperty('TransactionId')){
  obj.TransactionId = parseInt(obj.TransactionId)
}
   this.getTransaction(obj);
 
}
  trasactionList(obj){
    this._transactionService.transactionList(obj)
    .then((res: any) => {
      if (res && !res.StatusCode) {
        this.transactionType = res.Response.TotalTransaction;
        if (res.Response && 
          res.Response.Transactions && 
          res.Response.Transactions.length) {
          this.renderingComponent(TransactionTableComponent, {
            transaction: res.Response.Transactions,
            transactionCount: res.Response.TotalTransactionCount,
            searchParms : this.searchObject
          });
        } else {
          this.renderingComponent(NoFoundComponent, {
            icon: 'no-transaction',
            text: 'No Transaction(s) Found',
            subText: "You haven’t made any transaction"
          });
        }
      }
    }).catch(() => (console.log))
  }
  rangeForm() {
    this.dateRangeForm = this._formBuilder.group({
      FromDate: [this.dateFrom, Validators.required],
      ToDate: [this.dateTo, Validators.required]
    });
  }
  dateRangeChange(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
    console.log(this.dateRangeForm.value);
    if(dateRangeStart.value && dateRangeEnd.value) {
     this.dateRangeForm.value.FromDate = moment(dateRangeStart.value).format("MM-DD-YYYY");
     this.dateRangeForm.value.ToDate= moment(dateRangeEnd.value).format("MM-DD-YYYY");
     this.getTransaction();
   }
  }

  onOpen() {
    const matCalendar = 
    document.getElementsByClassName('mat-calendar-content')[0] as HTMLElement;
    matCalendar.appendChild(this.datepickerFooter.nativeElement);
}
serchingTransaction(){
 this.transactionSearch = [
  {label: "Status", ControlName: "Status" , option:[{
    value: "All",
    text: "All"
  },{
    value: this.transStatus.approved,
    text: "Approved"
  },
  {
    value: this.transStatus.declined,
    text: "Declined"
  }],
},
  {label: "Transaction Type", ControlName: "TransactionType", option:[{
    value: "All",
    text: "All"
  },
  {
    value: this.transType.CreditCardSale,
    text: "CreditCard - Sale"
  },
  {
    value: this.transType.CreditCardRefund,
    text: "CreditCard - Refund"
  },
  {
    value: this.transType.CreditCardVoid,
    text: "CreditCard - Void"
  },
  {
    value: this.transType.CreditCardAuth,
    text: "CreditCard - Authorize"
  },
  {
    value: this.transType.CreditCardCapture,
    text: "CreditCard - Capture"
  },
  {
    value: this.transType.ACHDebit,
    text: "ACH - Debit"
  },
  
  {
    value: this.transType.ACHRefund,
    text: "ACH - Refund"
  },
  {
    value: this.transType.ACHVoid,
    text: "ACH - Void"
  }
]},
  {label: "Transaction ID", ControlName: "TransactionId", type: "text" },
  {label: "Cardholder Name", ControlName: "CardholderName"},
  {label: "Card Last 4 Digits", ControlName: "Last4digit", type: "text", maxlength:"4", minlength :"4" },
  {label: "Amount", ControlName: "Amount", currencyMask:[
    { align: 'left', allowNegative: false }
  ] }
 ] 
}


setRange(range: string) {
    this.dateToFooter = moment();
    this.dateFromFooter = moment();
    let obj;
    switch (range) {
        case 'today':
            obj = {
                FromDate: this.dateFromFooter.format('YYYY-MM-DD'),
                ToDate: this.dateFromFooter.format('YYYY-MM-DD')
            }
            break;
            case 'yesterday':
                obj = {
                    FromDate: this.dateFromFooter.subtract(1,'d').format('YYYY-MM-DD'),
                    ToDate:  this.dateToFooter.subtract(1,'d').format('YYYY-MM-DD')
                      }
                break;
        case 'thisweek':
            obj = {
                FromDate: this.dateFromFooter.weekday(1).format('YYYY-MM-DD'),
                ToDate: this.dateToFooter.weekday(7).format('YYYY-MM-DD')
                  }
                break;
        case 'lastweek':
            obj = {
                FromDate: this.dateFromFooter.day(-7).weekday(1).format('YYYY-MM-DD'),
                ToDate: this.dateToFooter.day(-7).weekday(7).format('YYYY-MM-DD')
            }
            break;
        case 'thismonth':
            obj = {
                FromDate: this.dateFromFooter.startOf('month').format('YYYY-MM-DD'),
                ToDate: this.dateToFooter.endOf('month').format('YYYY-MM-DD')
            }
            break;
        case 'lastmonth':
            obj = {
                FromDate: this.dateFromFooter.subtract(1,'month').startOf('month').format('YYYY-MM-DD'),
                ToDate: this.dateToFooter.subtract(1,'month').endOf('month').format('YYYY-MM-DD')
            }
            break;    
        case 'last60':
            obj = {
                FromDate: this.dateFromFooter.subtract(60,'d').format('YYYY-MM-DD'),
                ToDate: this.dateToFooter.format('YYYY-MM-DD')   
                  }
            break;        
        case 'last90':
            obj = {
                FromDate: this.dateFromFooter.subtract(90,'d').format('YYYY-MM-DD'),
                ToDate:this.dateToFooter.format('YYYY-MM-DD')
                  }
            break;
        case 'thisyear':
            obj = {
                FromDate: this.dateFromFooter.startOf('year').format('YYYY-MM-DD'),
                ToDate: this.dateToFooter.endOf('year').format('YYYY-MM-DD')
            }
            break;

    }
    this.dateRangeForm.patchValue(obj);
    this.getTransaction();
    this.datePicker.close();

}



 
 exportFile(value){
    let obj = {ExportType: value,'IsExport': true};
    this.getTransaction(obj);
 }
 
}
