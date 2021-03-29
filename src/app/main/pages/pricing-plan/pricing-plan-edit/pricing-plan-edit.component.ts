import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { snackBarConfig } from '../../../../../constants/globalFunctions';
import { Subject } from 'rxjs';
import { PricingPlanService } from '../pricing-plan.service';
import { takeUntil, map, switchMap, tap } from 'rxjs/operators';
import { SlidingPanelService } from '@fuse/components/sliding-panel/sliding-panel.service';
import * as moment from 'moment';

@Component({
  selector: 'app-pricing-plan-edit',
  templateUrl: './pricing-plan-edit.component.html',
  styleUrls: ['./pricing-plan-edit.component.scss']
})
export class PricingPlanEditComponent implements OnInit, OnDestroy {

  public pricingPlanInfo: any = {};
  private _unsubscribeAll: Subject<any>;
  @Input() data: any;
  @Output() isClosed = new EventEmitter<any>();
  /**
     * Constructor
     *
     * @param {PricingPlanService} _pricingPlanService
     * @param {ActivatedRoute} _route
     * @param {MatSnackBar} _snackBar
     * @param {Router} _router
     * @param {ChangeDetectorRef} _cdref
     */
  constructor(
    private readonly _route : ActivatedRoute,
    private readonly _pricingPlanService: PricingPlanService,
    private readonly _snackBar: MatSnackBar,
    private readonly _router: Router,
    private _slidingPanelService:SlidingPanelService,
    private readonly _cdref: ChangeDetectorRef,

  ) { 
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this._cdref.detectChanges();
    if(this.data) {
      this.pricingPlanInfo = this.data;
    }
  }

  ngOnDestroy(): void{
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  
  updatePricingPlan(event){
    event.InsertedOn = this.pricingPlanInfo.InsertedOn;
    this._pricingPlanService.savePricingPlan(event)
    .then((res: any) => {
      if(res && !res.StatusCode){
        this._snackBar.open('Pricing plan updated', '', snackBarConfig);
        this._slidingPanelService.setSlidingPanelStatus("pricingPlanUpdate");
        this.closeSlidingPanel();
      }
  }).catch((err: HttpErrorResponse)=>(console.log))
  
  }
  closeSlidingPanel(): void {
    this._slidingPanelService.closeSlidingPanel('slidePanel').toggleOpen();
  }

}
