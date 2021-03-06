import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { SlidingPanelService } from '@fuse/components/sliding-panel/sliding-panel.service';
import { snackBarConfig } from 'constants/globalFunctions';
import { Subject } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ResellerService } from '../reseller.service';

@Component({
  selector: 'app-reseller-edit',
  templateUrl: './reseller-edit.component.html',
  styleUrls: ['./reseller-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ResellerEditComponent implements OnInit, OnDestroy {
  @Input() getPricingPlanBy: any;
  public resellerInfo: any = {};

  public assignPricingPlan: any = {}
  private _unsubscribeAll: Subject<any>;
  /**
     * Constructor
     *
     * @param {ResellerService} _resellerService
     * @param {ActivatedRoute} _route
     * @param {MatSnackBar} _snackBar
     * @param {ChangeDetectorRef} _cdref
     * @param {Router} _router
     * @param {SlidingPanelService} _slidingPanelService
     */
  constructor(
    private readonly _route : ActivatedRoute,
    private readonly _resellerService: ResellerService,
    private readonly _snackBar: MatSnackBar,
    private readonly _router: Router,
    private readonly _cdref: ChangeDetectorRef,
    private readonly _slidingPanelService: SlidingPanelService

  ) { 
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  
  ngOnInit(): void {
    this._cdref.detectChanges();
    this._route.paramMap
    .pipe(
      takeUntil(this._unsubscribeAll),
      map((param) => param.get('id')),
      switchMap((id) =>
        this._resellerService.getResellerDetail(id)
      ),
      tap((res: any) => (this.resellerInfo = res.Response)),
    )
    .subscribe();

  }

  updateReseller(event){
    this._resellerService.saveReseller(event)
    .then((res: any) => {
      if(res && !res.StatusCode){
        this._snackBar.open('Reseller updated', '', snackBarConfig);
        this._router.navigate(["/pages/reseller/reseller-list"])
      }
  }).catch((err: HttpErrorResponse)=>(console.log))
  
  }


  ngOnDestroy(): void{
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
    this._slidingPanelService.setSlidingPanelStatus(null);
  }
}
