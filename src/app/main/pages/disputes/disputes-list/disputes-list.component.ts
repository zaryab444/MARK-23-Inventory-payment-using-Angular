import { HttpErrorResponse } from '@angular/common/http';
import { Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, ElementRef, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { NoFoundComponent } from '@fuse/components/no-found/no-found.component';
import { UserConfigService } from '@fuse/services/user.config.service';
import { ResellerService } from 'app/main/pages/reseller/reseller.service';
import { TransactionService } from 'app/main/pages/transaction/transaction.service';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DisputesService } from '../disputes.service';
import { AllDisputesTableComponent } from '../tabs/all-disputes/all-disputes.component';
import { LostDisputesTableComponent } from '../tabs/lost-disputes/lost-disputes.component';
import { WonDisputesTableComponent } from '../tabs/won-disputes/won-disputes.component';



@Component({
  selector: 'app-disputes-list',
  templateUrl: './disputes-list.component.html',
  styleUrls: ['./disputes-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AllDisputesComponent implements OnInit {
  @ViewChild('renderingContainerAll', { read: ViewContainerRef }) Allcontainer: ViewContainerRef;
  @ViewChild('renderingContainerWon', { read: ViewContainerRef }) Woncontainer: ViewContainerRef;
  @ViewChild('renderingContainerLost', { read: ViewContainerRef }) Lostcontainer: ViewContainerRef;
  private componentRefAll: ComponentRef<any>;
  private componentRefWon: ComponentRef<any>;
  private componentRefLost: ComponentRef<any>;
  private _unsubscribeAll: Subject<any>;
 

  public disputes: any[] = [];
  public resellers: any = [];
  public allDisputesForm: FormGroup;
  public panelChangesSubscriber: any
    UserRole: any;
    AllDisputes: any;
    WonDisputes: any;
    LostDisputes: any;




//date filter
    @ViewChild('picker') datePicker: MatDatepicker<any>;
    @ViewChild('datepickerFooter', {static: false}) datepickerFooter: ElementRef;
    dateRangeForm: FormGroup;
    dateTo = moment().format('YYYY-MM-DD');
    dateFrom = moment().subtract(15, 'd').format('YYYY-MM-DD');
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

//date filter

  /**
     * Constructor
     * @param {UserConfigService} _userConfigService
     * @param {ResellerService} _resellerService
     * @param {FormBuilder} _formBuilder
  */
  constructor(
    private readonly _DisputesService : DisputesService,
    private readonly _userConfigService: UserConfigService,
    private readonly _resellerService: ResellerService,
    private readonly _formBuilder: FormBuilder,
    private readonly _resolver: ComponentFactoryResolver,
    private readonly _transactionService: TransactionService,


  ) { 
    this._unsubscribeAll = new Subject();

  }

  ngOnInit(): void {
    this.rangeForm();
    this._userConfigService.userModeChange
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(() =>  this.getDisputes());
    this.panelChangesSubscriber = this._DisputesService.panelChange.subscribe((res: any) => {
      
        if (res) {
          this.getDisputes();
        }
      })
  }
 
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
    this.componentRefAll && this.componentRefAll.destroy();
    this.componentRefWon && this.componentRefWon.destroy();
    this.componentRefLost && this.componentRefLost.destroy();
   
  }


  renderingComponent(type?, data?) {
  if(data.disputeType == 'All'){
      const factory: ComponentFactory<any> = this._resolver.resolveComponentFactory(type);
      this.Allcontainer.clear();
      this.componentRefAll = this.Allcontainer.createComponent(factory);
      this.componentRefAll.instance.data = data;
      this.componentRefAll.instance.ExportCall.subscribe((res: any) => {
        this.getDisputes(res);
      });
  }
  else if(data.disputeType == 'Won'){
    const factory: ComponentFactory<any> = this._resolver.resolveComponentFactory(type);
    this.Woncontainer.clear();
    this.componentRefWon = this.Woncontainer.createComponent(factory);
    this.componentRefWon.instance.data = data;
}
else if(data.disputeType == 'Lost')
{
  const factory: ComponentFactory<any> = this._resolver.resolveComponentFactory(type);
  this.Lostcontainer.clear();
  this.componentRefLost = this.Lostcontainer.createComponent(factory);
  this.componentRefLost.instance.data = data;
}



  }

  getDisputes(value?): void{
    this.dateRangeForm.value.FromDate = moment(this.dateRangeForm.value.FromDate).format("MM-DD-YYYY");
    this.dateRangeForm.value.ToDate= moment(this.dateRangeForm.value.ToDate).format("MM-DD-YYYY");


    const user = this._userConfigService.getUserMode();
    let obj = user
    if (user == null){
        obj = {};
    } else if (user.hasOwnProperty('UserRoleId')){
if(user.UserRoleId == 1)
{
    obj = {};
}
    }
    else if (user.hasOwnProperty('PartnerId')) {
      obj = {
        EntityId: user.PartnerId,
        UserRoleId : 3
     
      }
    } else if (user.hasOwnProperty('ResellerId')) {
      obj = {
        EntityId: user.ResellerId,
        UserRoleId : 4
      
      }
    } else if (user.hasOwnProperty('MerchantId')) {
      obj = {
        EntityId: user.MerchantId,
        UserRoleId : 2
      }
    } 
 //    if(value?.IsExport){
      obj = {
        ...obj,
        ...value,
        ...this.dateRangeForm.value,
      }
 //   }
    // else{
    //     obj = {
    //         ...obj,
    //         ...value,
    //         ...this.dateRangeForm.value,
    //       }
    // }
   

    this._DisputesService.disputeList(obj).then((res: any) => {
 
        if (res && !res.StatusCode) {
            if (res.Response && res.Response.DisputeViewModel.length) {
              if(res.Response.FileUrl){
                let url = res.Response.FileUrl
                window.open(url, "_blank"); 
              }
            if (user.hasOwnProperty('ResellerId')){
        
             this.WonDisputes =  res.Response.DisputeViewModel.filter(x => (x.Info != null) && (x.Info.ResellerId == user.ResellerId && x.Dispute.status === 'won'))
             this.LostDisputes = res.Response.DisputeViewModel.filter(x => (x.Info != null) && (x.Info.ResellerId == user.ResellerId && x.Dispute.status === 'lost'))
             this.AllDisputes = res.Response.DisputeViewModel.filter(x => (x.Info != null) && (x.Info.ResellerId == user.ResellerId));
            }
             else {
                  this.WonDisputes =  res.Response.DisputeViewModel.filter(x =>(x.Info != null) && (x.Info.MerchantId == user.MerchantId) && x.Dispute.status === 'won')
                  this.LostDisputes =  res.Response.DisputeViewModel.filter(x => (x.Info != null) && (x.Info.MerchantId == user.MerchantId) && x.Dispute.status === 'lost')
                  this.AllDisputes =  res.Response.DisputeViewModel.filter(x => (x.Info != null) && (x.Info.MerchantId == user.MerchantId))
                }
                if(this.AllDisputes.length){

                    this.renderingComponent(AllDisputesTableComponent,{
                        data: this.AllDisputes,
                        disputeType : 'All'
                      });
              
            }
             else {
                this.renderingComponent(NoFoundComponent, {
                    icon: 'no-dispute',
                    text: 'No Dispute found',
                    subText: "No disputed payments",
                    disputeType : 'All'
                  });
            }
            if(this.WonDisputes.length){

              this.renderingComponent(WonDisputesTableComponent,{
                  data: this.WonDisputes,
                  disputeType : 'Won'
                });
        
      }
       else {
          this.renderingComponent(NoFoundComponent, {
              icon: 'no-dispute',
              text: 'No Dispute found',
              subText: "No disputed payments",
              disputeType : 'Won'
            });
      }
      if(this.LostDisputes.length){

        this.renderingComponent(LostDisputesTableComponent,{
            data: this.LostDisputes,
            disputeType : 'Lost'
          });
  
}

 else {
    this.renderingComponent(NoFoundComponent, {
        icon: 'no-dispute',
        text: 'No Dispute found',
        subText: "No disputed payments",
        disputeType : 'Lost'
      });
}

}
else {
  this.renderingComponent(NoFoundComponent, {
      icon: 'no-dispute',
      text: 'No Dispute found',
      subText: "No disputed payments",
      disputeType : 'All'
    });
    this.renderingComponent(NoFoundComponent, {
      icon: 'no-dispute',
      text: 'No Dispute found',
      subText: "No disputed payments",
      disputeType : 'Won'
    });
    this.renderingComponent(NoFoundComponent, {
      icon: 'no-dispute',
      text: 'No Dispute found',
      subText: "No disputed payments",
      disputeType : 'Lost'
    });
}  
        }    
    }).catch((err) => {
      console.log(err)
    });

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
     this.getDisputes();
   }
   
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
    this.getDisputes(obj);
    this.datePicker.close();
  
  }
  
  onOpen() {
    const matCalendar = 
    document.getElementsByClassName('mat-calendar-content')[0] as HTMLElement;
    matCalendar.appendChild(this.datepickerFooter.nativeElement);
    }

}



