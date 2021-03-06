import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { SlidingPanelService } from '@fuse/components/sliding-panel/sliding-panel.service';
import { snackBarConfig } from 'constants/globalFunctions';
import { Subject } from 'rxjs';
import { takeUntil, map, switchMap, tap } from 'rxjs/operators';
import { PartnerService } from '../partner.service';

@Component({
  selector: 'app-partner-edit',
  templateUrl: './partner-edit.component.html',
  styleUrls: ['./partner-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PartnerEditComponent implements OnInit, OnDestroy {

  public partnerInfo: any = {};
  private _unsubscribeAll: Subject<any>;
  /**
     * Constructor
     *
     * @param {PartnerService} _partnerService
     * @param {ActivatedRoute} _route
     * @param {MatSnackBar} _snackBar
     * @param {ChangeDetectorRef} _cdref
     * @param {Router} _router
     */
  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _partnerService: PartnerService,
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
        this._partnerService.getPartnerDetail(id)
      ),
      tap((res: any) => (this.partnerInfo = res.Response)),
    )
    .subscribe();
    // this.partnerInfo.UserRoleId = 3;
  }

  updatePartner(event: any){
   
    this._partnerService.savePartner(event)
    .then((res: any) => {
      if(res && !res.StatusCode){
        this._snackBar.open('Partner updated', '', snackBarConfig);
        this._router.navigate(["/pages/partner/partner-list"])
     
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
