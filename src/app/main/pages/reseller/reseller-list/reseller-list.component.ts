import { HttpErrorResponse } from '@angular/common/http';
import { Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NoFoundComponent } from '@fuse/components/no-found/no-found.component';
import { SlidingPanelService } from '@fuse/components/sliding-panel/sliding-panel.service';
import { UserConfigService } from '@fuse/services/user.config.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ResellerTableComponent } from '../reseller-table/reseller-table.component';
import { ResellerService } from '../reseller.service';
import * as globalConfig from '../../../../../constants/globalFunctions';
import { AdvancedSearchComponent } from '@fuse/components/advanced-search/advanced-search.component';
import { ExportType } from '../../../../../constants/globalFunctions';

declare const require: any
const FileSaver = require('file-saver');
@Component({
  selector: 'app-reseller-list',
  templateUrl: './reseller-list.component.html',
  styleUrls: ['./reseller-list.component.scss']
})
export class ResellerListComponent implements OnInit, OnDestroy {
  @Input() getUserBy : any;
  @ViewChild('renderingContainer', { read: ViewContainerRef }) container: ViewContainerRef;
  private componentRef: ComponentRef<any>;
  public showShimmer : boolean = false;
  public resellers: any= [];
  private _unsubscribeAll: Subject<any>;
  public ResellerSearchForm: FormGroup;
  public globalConfig = globalConfig;
  public ResellerSearchField = [];
  public Exporttypepdf = ExportType.pdf;
  public Exporttypecsv = ExportType.csv;
  @ViewChild(AdvancedSearchComponent) childComponentMenu: AdvancedSearchComponent;
  public panelChangesSubscriber: any;
  public AdvSearch: any;
     /**
     * Constructor
     *
     * @param {ResellerService} _resellerService
     * @param {UserConfigService} _userConfigService
     * @param {SlidingPanelService} _slidingPanelService
     * @param {ComponentFactoryResolver} _resolver
     */
    
    constructor(
      private readonly _resellerService: ResellerService,
      private readonly _userConfigService: UserConfigService,
      private readonly _resolver: ComponentFactoryResolver,
      private readonly _slidingPanelService: SlidingPanelService,
  ) { 
            // Set the private defaults
            this._unsubscribeAll = new Subject();
            this.ResellerSearchField = [
              { label: "Reseller Name ", ControlName: "ResellerName" },
              { label: "Partner Name ", ControlName: "PartnerName" },
              { label: "Email ", ControlName: "Email" },
             
            ];
  }

  ngOnInit(): void {
    this._userConfigService.userModeChange
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(() => this.getResellers());
    this.panelChangesSubscriber = this._slidingPanelService.panelChange.subscribe((res: any) => {
      if (res == "resellerCreated") {
        this.getResellers()
      }
    })
  }

  ngOnDestroy(): void {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
      this.componentRef && this.componentRef.destroy();
      this.panelChangesSubscriber.unsubscribe();

  }
  renderingComponent(type, data?) {
   
   const factory: ComponentFactory<any> = this._resolver.resolveComponentFactory(type);
      this.container.clear();
      this.componentRef = this.container.createComponent(factory);
      this.componentRef.instance.data = data;
      this.componentRef.instance.ExportCall.subscribe((res: any) => {
        this.getResellers(res);
      });
  }
  getResellers(value?): void{
    let obj;
    if(value?.IsExport){
         obj= {
    ...this._userConfigService.getUserMode(), 
    ...value,
    ...this.AdvSearch,
    }
    }
    else if (this.AdvSearch?.search) {
        
      delete this.AdvSearch.UserRoleId;
      delete this.AdvSearch.EntityId;
      delete this.AdvSearch.AdminId;
      delete this.AdvSearch.PartnerId;
      delete this.AdvSearch.ResellerId;
      delete this.AdvSearch.MerchantId;
      obj = {
          ...this._userConfigService.getUserMode(),
          ...this.AdvSearch,
      };

  }
    else{
       obj = {
        ...this._userConfigService.getUserMode(),
        RecordLimit: 100,
        PageNo: 1,
        ...value
      }
   
    }
 
    this._resellerService.resellerList(obj)
    .then((res: any) => {
        if(res && !res.StatusCode){
          if(res.Response && res.Response.Resellers.length){
              this.showShimmer = true;
            this.resellers = res.Response.Resellers;
            if(res.Response.FileUrl){
              //FileSaver.saveAs(res.Response.FileUrl);
              let url = res.Response.FileUrl
              window.open(url, "_blank"); 
            }
            this.renderingComponent(ResellerTableComponent,{
              resellers: this.resellers,
              resellerCount: res.Response.TotalCount
            })
          }else{
            this.renderingComponent(NoFoundComponent, {
              icon: 'no-reseller',
              text: 'No Reseller(s) Found',
              subText: "You haven't made any Reseller yet"
            });
          }
        }
    }).catch((err: HttpErrorResponse)=>(console.log))
  }
  openSlidePanel(): void{
  
    this._slidingPanelService.getSidebar('slidePanel', 'ResellerCreateComponent').toggleOpen();
}
searchreseller(obj){
  let a = {
    search: "resellerSearch",
};

obj = { ...a, ...obj };
this.AdvSearch = obj;
this.getResellers(obj);

}

}
