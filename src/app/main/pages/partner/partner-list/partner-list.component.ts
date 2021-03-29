import { HttpErrorResponse } from '@angular/common/http';
import { Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { NoFoundComponent } from '@fuse/components/no-found/no-found.component';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { SlidingPanelService } from '@fuse/components/sliding-panel/sliding-panel.service';
import { UserConfigService } from '@fuse/services/user.config.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PartnerTableComponent } from '../partner-table/partner-table.component';
import { PartnerService } from '../partner.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as globalConfig from '../../../../../constants/globalFunctions';
import { AdvancedSearchComponent } from '@fuse/components/advanced-search/advanced-search.component';
import { ExportType } from '../../../../../constants/globalFunctions';

declare const require: any
const FileSaver = require('file-saver');
@Component({
  selector: 'app-partner-list',
  templateUrl: './partner-list.component.html',
  styleUrls: ['./partner-list.component.scss']
})
export class PartnerListComponent implements OnInit, OnDestroy {
  @ViewChild('renderingContainer', { read: ViewContainerRef }) container: ViewContainerRef;
 
  private componentRef: ComponentRef<any>;
  public partners: any[] = [];
  private _unsubscribeAll: Subject<any>;
  public partnerSearchForm: FormGroup;
  public globalConfig = globalConfig;
  @ViewChild(AdvancedSearchComponent) childComponentMenu: AdvancedSearchComponent;
  public PartnerSearchField = [];
  public panelChangesSubscriber: Subject<any>;
  public Exporttypepdf = ExportType.pdf;
  public Exporttypecsv = ExportType.csv;
  public AdvSearch;
  public showShimmer : boolean = false;
  
  /**
  * Constructor
  *
  * @param {PartnerService} _partnerService
  * @param {UserConfigService} _userConfigService
  * @param {ComponentFactoryResolver} _resolver
  * @param {SlidingPanelService} _slidingPanelService
  */

  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _partnerService: PartnerService,
    private readonly _userConfigService: UserConfigService,
    private readonly _resolver: ComponentFactoryResolver,
    private readonly _slidingPanelService: SlidingPanelService,

  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    this.panelChangesSubscriber = new Subject();
    this.PartnerSearchField = [
      { label: "Partner Name ", ControlName: "PartnerName" },
      { label: "Dba Name ", ControlName: "DBAName" },
      { label: "Email ", ControlName: "Email" }
    ];
  }
  ngOnInit(): void {
    this._userConfigService.userModeChange
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(() => this.getPartners());
    this._slidingPanelService.panelChange.pipe(takeUntil(this.panelChangesSubscriber)).subscribe((res: any) => {
      if (res == 'PartnerCreated' ) {
        this.getPartners();
   
      }  
    })
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
    this.componentRef && this.componentRef.destroy();
    this._slidingPanelService.setSlidingPanelStatus(null);
    this.panelChangesSubscriber.next();
    this.panelChangesSubscriber.complete();
    this.panelChangesSubscriber.unsubscribe();

  }
  renderingComponent(type, data?) {
      const factory: ComponentFactory<any> = this._resolver.resolveComponentFactory(type);
      this.container.clear();
      this.componentRef = this.container.createComponent(factory);
      this.componentRef.instance.data = data;
      this.componentRef.instance.ExportCall.subscribe((res: any) => {
        this.getPartners(res);
      });
  }

  getPartners(value?): void {
  let obj;
    if(value?.IsExport){
         obj= {
    ...this._userConfigService.getUserMode(), 
    ...value,
    ...this.AdvSearch
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
 
    this._partnerService.partnerList(obj)
      .then((res: any) => {
        if (res && !res.StatusCode) {
          if (res.Response && res.Response.Partners.length) {
              this.showShimmer = true;
            this.partners = res.Response.Partners
            if(res.Response.FileUrl){
              let url = res.Response.FileUrl
              window.open(url, "_blank"); 
            }
            this.renderingComponent(PartnerTableComponent, {
              partners: res.Response.Partners,
              partnerCount: res.Response.TotalCount
            })
          } else {
            this.renderingComponent(NoFoundComponent, {
              icon: 'no-partner',
              text: 'No Partner(s) Found',
              subText: "You haven't made any Partner"
            });
          }
        }
      }).catch((err: HttpErrorResponse) => (console.log))
  }

  openSlidePanel(): void {

    this._slidingPanelService.getSidebar('slidePanel', 'PartnerCreateComponent').toggleOpen();
  }
  searchpartner(obj) {
    let a = {
      search: "partnerSearch",
  };
  
  obj = { ...a, ...obj };
  this.AdvSearch = obj;
  this.getPartners(obj);
  
  }
}
