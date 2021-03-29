import { HttpErrorResponse } from '@angular/common/http';
import { Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { NoFoundComponent } from '@fuse/components/no-found/no-found.component';
import { UserConfigService } from '@fuse/services/user.config.service';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SummmaryTableComponent } from '../common-components/summmary-table/summmary-table.component';
import { ReportManagerService } from '../report-manager.service';

@Component({
  selector: 'app-transactions-summary',
  templateUrl: './transactions-summary.component.html',
  styleUrls: ['./transactions-summary.component.scss'],

})
export class TransactionsSummaryComponent implements OnInit {
  public hello: any;
  @ViewChild('renderingcontainer', { read: ViewContainerRef }) container: ViewContainerRef;
  @ViewChild('picker') datePicker: MatDatepicker<any>;
  @ViewChild('datepickerFooter', { static: false }) datepickerFooter: ElementRef;
  private summaryComponentRef: ComponentRef<any>;
  public ReportData = [];
  public dataLoaded = false;
  private _unsubscribeAll: Subject<any>;
  public isDefault = false;
  public currentUser : any ={}
  public dateRangeForm: FormGroup;
  public dateTo = moment().format('YYYY-MM-DD');
  public dateFrom = moment().subtract(90, 'd').format('YYYY-MM-DD');

  public ranges: Array<{ key: string, label: string }> = [
    { key: 'today', label: 'Today' },
    { key: 'yesterday', label: 'Yesterday' },
    { key: 'thisweek', label: 'This Week' },
    { key: 'lastweek', label: 'Last Week' },
    { key: 'thismonth', label: 'This Month' },
    { key: 'lastmonth', label: 'Last Month' },
    { key: 'last60', label: 'Last 60 Days' },
    { key: 'last90', label: 'Last 90 Days' },
    { key: 'thisyear', label: 'This Year' },
  ];
  public dateToFooter = moment();
  public dateFromFooter = moment();
  constructor(
    private readonly _resolver: ComponentFactoryResolver,
    private readonly _reportManagerService: ReportManagerService,
    private readonly _userConfigService: UserConfigService,
    private readonly _formBuilder: FormBuilder
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.summaryComponentRef && this.summaryComponentRef.destroy();
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  ngOnInit(): void {
    this.rangeForm();
    this._userConfigService.userModeChange
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => this.getSummaryList())
  }
  rangeForm() {
    this.dateRangeForm = this._formBuilder.group({
      FromDate: [this.dateFrom, Validators.required],
      ToDate: [this.dateTo, Validators.required]
    });
  }

  renderingComponent(type, data?) {
    const factory: ComponentFactory<any> = this._resolver.resolveComponentFactory(type);
    this.container.clear();
    this.summaryComponentRef = this.container.createComponent(factory);
    this.summaryComponentRef.instance.data = data;
    this.summaryComponentRef.instance.update.subscribe((res:any) => {
    if(res) {
     this.isDefault = true
     this.getSummaryList(res,0)
    }
    })
    this.summaryComponentRef.instance.ExportCall.subscribe((res:any) => {
      if(res) {
       this.getSummaryList(res,1)
      }
      })
  }
  callDefault() {
    this.isDefault = false;
    this.getSummaryList();
  }
  getSummaryList(data?,isExport?): void {
    let userMode = this._userConfigService.getUserMode();
    this.dateRangeForm.value.FromDate = moment(this.dateRangeForm.value.FromDate).format("MM-DD-YYYY");
    this.dateRangeForm.value.ToDate= moment(this.dateRangeForm.value.ToDate).format("MM-DD-YYYY");
    
    if (data && !isExport) {
      userMode = data
      this.currentUser = data
    } else {
      if(userMode == null) {
        userMode = {
          UserRoleId: 1,
          EntityId: 0
        }
      } else if(userMode.hasOwnProperty('PartnerId')) {
        userMode = {
          UserRoleId: 3,
          EntityId: userMode.PartnerId
        }
      } else if(userMode.hasOwnProperty('ResellerId')) {
        userMode = {
          UserRoleId: 4,
          EntityId: userMode.ResellerId
        } 
      } else if(userMode.hasOwnProperty('MerchantId')) {
        userMode = {
          UserRoleId: 2,
          EntityId: userMode.MerchantId
        }
      }
    } 
    const obj = {
      ...this.dateRangeForm.value,
      ...userMode,
      ...data
    }
    this._reportManagerService.summaryList(obj)
      .then((res: any) => {
        if (res && !res.StatusCode) {
          if (res.Response.Transactions.length > 0) {
            if(res.Response.FileUrl){
              let url = res.Response.FileUrl
              window.open(url, "_blank"); 
            }
            this.renderingComponent(SummmaryTableComponent, {
              data: res.Response.Transactions,
              currentUser:this.currentUser,
              name: 'TransactionSummary'
            });
          } else {
            this.renderingComponent(NoFoundComponent, {
              icon: 'no-transaction',
              text: 'No Data Found',
              subText: "You haven’t made any transaction"
            });
          }

        }
      }).catch((err: HttpErrorResponse) => (console.log));
  }
  onOpen() {
    const matCalendar =
      document.getElementsByClassName('mat-calendar-content')[0] as HTMLElement;
    matCalendar.appendChild(this.datepickerFooter.nativeElement);
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
          FromDate: this.dateFromFooter.subtract(1, 'd').format('YYYY-MM-DD'),
          ToDate: this.dateToFooter.subtract(1, 'd').format('YYYY-MM-DD')
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
          FromDate: this.dateFromFooter.subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
          ToDate: this.dateToFooter.subtract(1, 'month').endOf('month').format('YYYY-MM-DD')
        }
        break;
      case 'last60':
        obj = {
          FromDate: this.dateFromFooter.subtract(60, 'd').format('YYYY-MM-DD'),
          ToDate: this.dateToFooter.format('YYYY-MM-DD')
        }
        break;
      case 'last90':
        obj = {
          FromDate: this.dateFromFooter.subtract(90, 'd').format('YYYY-MM-DD'),
          ToDate: this.dateToFooter.format('YYYY-MM-DD')
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
    this.getSummaryList();
    this.datePicker.close();

  }
  dateRangeChange(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
    console.log(this.dateRangeForm.value);
    if (dateRangeStart.value && dateRangeEnd.value) {
      this.dateRangeForm.value.FromDate = moment(dateRangeStart.value).format("MM-DD-YYYY");
      this.dateRangeForm.value.ToDate = moment(dateRangeEnd.value).format("MM-DD-YYYY ");
      this.getSummaryList();
    }
  }
}
