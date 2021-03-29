import { HttpErrorResponse } from '@angular/common/http';
import { Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, Input, OnChanges, OnDestroy, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { NoFoundComponent } from '@fuse/components/no-found/no-found.component';
import { UserConfigService } from '@fuse/services/user.config.service';
import { authRole } from '../../../../../constants/globalFunctions';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MerchantService } from '../../merchant/merchant.service';
import { PartnerService } from '../../partner/partner.service';
import { ResellerService } from '../../reseller/reseller.service';
import { PricingPlanTableComponent } from '../pricing-plan-table/pricing-plan-table.component';
import { PricingPlanService } from '../pricing-plan.service';
import { SlidingPanelService } from '@fuse/components/sliding-panel/sliding-panel.service';
import { Router } from '@angular/router';
import { IfStmt } from '@angular/compiler';

@Component({
  selector: 'app-pricing-plan-list',
  templateUrl: './pricing-plan-list.component.html',
  styleUrls: ['./pricing-plan-list.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class PricingPlanListComponent implements OnInit, OnDestroy, OnChanges {
  public CreateSearchField : any = [];

  @ViewChild('renderingContainer', { read: ViewContainerRef }) container: ViewContainerRef;
  private componentRef: ComponentRef<any>;
  public searchObject : any;

  public pricingPlans: any[] = [];
  @Input() getPricingPlanBy: any = null;
  @Input() headerVisibility: boolean = true;
  private _unsubscribeAll: Subject<any>;
  public assignPricingPlan: any = {}
  public panelChangesSubscriber: Subject<any>;

  /**
  * Constructor
  *
  * @param {PricingPlanService} _pricingPlanService
  * @param {UserConfigService} _userConfigService
  * @param {ComponentFactoryResolver} _resolver
  * @param {MerchantService} _merchantService
  * @param {ResellerService} _resellerService
  * @param {PartnerService} _partnerService
  * @param {SlidingPanelService} _slidingPanelService
  * @param {ChangeDetectorRef} _cdref
  * @param {Router} router
  */

  constructor(
    private readonly _pricingPlanService: PricingPlanService,
    private readonly _userConfigService: UserConfigService,
    private readonly _merchantService: MerchantService,
    private readonly _resellerService: ResellerService,
    private readonly _partnerService: PartnerService,
    private readonly _resolver: ComponentFactoryResolver,
    private readonly _slidingPanelService: SlidingPanelService,
    public router: Router,
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    this.panelChangesSubscriber = new Subject();
  }

  ngOnInit(): void {
    if (this.headerVisibility){
      this._userConfigService.userModeChange
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this.getPricingPlanBy = this._userConfigService.getUserMode();
        this.getPricingPlans();
       
      });
    }  
     this._slidingPanelService.panelChange.pipe(takeUntil(this.panelChangesSubscriber)).
     subscribe((res: any) => {
      
      if (res == "assignPricingPlan" || res == "unAssignPricingPlan" || res == "pricingPlanUpdate" || res == "pricingPlanCreate") {
        this.getPricingPlans();
        this._slidingPanelService.setSlidingPanelStatus(null);

      }
    })
  }

  ngOnChanges(): void {
    if (this.getPricingPlanBy &&
      Object.keys(this.getPricingPlanBy).length &&
      Object.values(this.getPricingPlanBy).toString()) {
      this.getPricingPlans();
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
    this.componentRef && this.componentRef.destroy();
  }

  renderingComponent(type, data?): void {
    const factory: ComponentFactory<any> = this._resolver.resolveComponentFactory(type);
    this.container.clear();
    this.componentRef = this.container.createComponent(factory);
    this.componentRef.instance.data = data;
    this.componentRef.instance.ExportCall.subscribe(res => {
      if (res) {
        this.getPricingPlans(res);
      }
    })
  }
  getPricingPlans(value?): void {
    let obj = {
      ...this.getPricingPlanBy,
      ...value
    };
     
    if(this.searchObject && this.searchObject.hasOwnProperty('search')){
      obj = {...obj ,...this.searchObject}
      delete obj.UserRoleId;
      delete obj.AdminId;
      delete obj.EntityId;     
     
    }
    // if(value.IsExport){
    //   obj ={...value, ...obj }
    // }
    this._pricingPlanService.pricingPlanList(obj)
      .then((res: any) => {
        if (res && !res.StatusCode) {
          if (res.Response && res.Response.PricingPlans.length) {
            this.pricingPlans = res.Response.PricingPlans;
            this.assignPricingPlan = this.assignPlan(this.getPricingPlanBy);
            if(res.Response.FileUrl){
              let url = res.Response.FileUrl
              window.open(url, "_blank"); 
            }
            this.renderingComponent(PricingPlanTableComponent, {
              pricingPlans: this.pricingPlans,
              assignPricingPlan: this.assignPricingPlan
            })
          } else {
            this.renderingComponent(NoFoundComponent, {
              icon: 'no-pricing-plan',
              text: 'No Pricing Plan(s) Found',
              subText: (this.headerVisibility) ?
                "You Haven't made any Pricing Plan yet" :
                "You haven't been assigned any Pricing Plan yet"
            });
          }

        }
      }).catch((err: HttpErrorResponse) => (console.log))
  }

  getPartners(obj: any): Promise<any[]> {
    return this._partnerService.partnerList(obj)
      .then((res: any) => {
        if (res && !res.StatusCode) {
          return res.Response.Partners.sort((a, b) => a.PartnerName.localeCompare(b.PartnerName)).map((item: any) => {
            return {
              id: item.PartnerId,
              name: item.PartnerName,
              pricingPlanIds: item.PricingPlanIds
            };
          });
        }
      }).catch((err: HttpErrorResponse) => (console.log))
  }

  getResellers(obj: any): Promise<any[]> {
    return this._resellerService.resellerList(obj)
      .then((res: any) => {
        if (res && !res.StatusCode) {
          return res.Response.Resellers.sort((a, b) => a.ResellerName.localeCompare(b.ResellerName)).map((item: any) => {
            return {
              id: item.ResellerId,
              name: item.ResellerName,
              pricingPlanIds: item.PricingPlanIds

            };
          });
        }
      }).catch((err: HttpErrorResponse) => (console.log))
  }

  getMerchants(obj: any): Promise<any[]> {
    return this._merchantService.merchantList(obj)


      .then((res: any) => {
        if (res && !res.StatusCode) {
          return res.Response.Merchants.filter(data => data.MerchantAccountSetup).sort((a, b) =>
            a.MerchantAccountSetup.MerchantUserName.localeCompare(b.MerchantAccountSetup.MerchantUserName))
            .map((item: any) => {

              return {
                id: item.MerchantId,
                name: item.MerchantAccountSetup.MerchantUserName,
                pricingPlanIds: [item.MerchantAccountSetup.PricingPlanID]

              };
            });
        }
      }).catch((err: HttpErrorResponse) => (console.log))
  }


  assignPlan(obj: any): any {

    const object: any = {};
    if (!obj || (obj.UserRoleId == 1)) {
      object.AssignTo = 'Partners';
      object.UserRoleId = authRole.partner;
      this.getPartners(obj).then(res => object.AssigneeList = res);
    }
    else if (obj
      && obj.hasOwnProperty('PartnerId')) {
      object.AssignTo = 'Resellers';
      object.UserRoleId = authRole.reseller;
      this.getResellers(obj).then(res => object.AssigneeList = res)

    } else {
      object.AssignTo = 'Merchants';
      object.UserRoleId = authRole.merchant;
      this.getMerchants(obj).then(res => object.AssigneeList = res)

    }
    return object;
  }
  openSlidePanel(): void {
    this._slidingPanelService.getSidebar('slidePanel', 'PricingPlanCreateComponent').toggleOpen();
  }


pricingPlanSearchFields(){
  this.CreateSearchField = [
    { label: "Pricing Plan Title", ControlName: "PricingTitle" },
    { label: "Per Transaction Fee ($)", ControlName: "PerTransactionFee", currencyMask:[
      { align: 'left', allowNegative: false }
    ] },
    { label: "Transaction Fee (%)", ControlName: "TransactionFee" , currencyMask:[
      { align: 'left', prefix: '',suffix: '',allowNegative: false }
    ]}
  ];
  return this.CreateSearchField;
}
searchPricingPlan(obj){
  let a ={
    search: 'pricingPlanSearch'
  }
  obj = {...a, ...obj}
  this.searchObject = obj;
  this.getPricingPlans(obj);
}



}
