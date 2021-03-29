import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {  MatSnackBar} from '@angular/material/snack-bar';
import {  MatTableDataSource } from '@angular/material/table';
import { UserConfigService } from '@fuse/services/user.config.service';
import { PricingPlanService } from 'app/main/pages/pricing-plan/pricing-plan.service';
import { snackBarConfig, snackBarConfigWarn } from '../../../constants/globalFunctions';
import { FuseConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { SlidingPanelService } from '../sliding-panel/sliding-panel.service';

@Component({
  selector: 'app-assignee-dialog',
  templateUrl: './assignee-dialog.component.html',
  styleUrls: ['./assignee-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  
})
export class AssigneeDialogComponent implements OnInit {

    public displayedColumns: string[] = ['action', 'PricingTitle'];
    inputStr: string = '';
  public selectedAssignee = new FormControl([]);
  public dataSource = new MatTableDataSource<any>();
  public selectedChips: any[] = [];
  public initiallength: any[] = [];
  public idExists : boolean = false;
  public tableData: any[] = [];
  public list;
  public changesMade : boolean = true;

  @Input() data: any;
 

    @Output() closedForms = new EventEmitter<any>();
  public noFound;
    checkForUserRole: any;
    public userType;

  /**
 * Constructor
 *
 *@param {MatDialog} _dialog
 * @param {PricingPlanService} _pricingPlanService  
 */

  constructor(
   // public readonly _dialogRef: MatDialogRef<any>,
   private readonly _dialog: MatDialog,
    private readonly _pricingPlanService: PricingPlanService,
    private readonly _snackBar: MatSnackBar,
    private _slidingPanelService:SlidingPanelService,
    private _userConfigService:UserConfigService

  ) { }

  ngOnInit(): void {

    this.userType =   this._userConfigService.loggedInUser.UserRoleId

    this.checkForUserRole = this._userConfigService.getUserMode();


    (!this.data.assignPricingPlan.AssigneeList.length)?
      this.noFound = true:
      this.noFound = false;
  
    this.selectedChips = this.data.assignPricingPlan.AssigneeList && this.data.assignPricingPlan.AssigneeList.filter((obj) =>
      obj.pricingPlanIds && obj.pricingPlanIds.indexOf(this.data.assignPricingPlan.PricingPlanID) >= 0
      )
this.initiallength = this.data.assignPricingPlan.AssigneeList && this.data.assignPricingPlan.AssigneeList.filter((obj) =>
obj.pricingPlanIds && obj.pricingPlanIds.indexOf(this.data.assignPricingPlan.PricingPlanID) >= 0
)
    if (this.selectedChips && this.selectedChips.length) {
        this.list = this.selectedChips.map(item => item.id)
      this.selectedAssignee.setValue(this.list);
    }
    else{
      this.list = []
    }
    this.tableData = this.data.assignPricingPlan.AssigneeList.map(
        (elem) => { 
        if(this.list.length ){
            if(this.list.indexOf(elem.id) != -1 )
            {
                elem.alreadyChecked = true
                if(this.checkForUserRole.hasOwnProperty('ResellerId')){
                    elem.isMerchant = true 
                }
             elem.idExists = true
            
            }
            else
            { 
                elem.alreadyChecked = false
                if(this.checkForUserRole.hasOwnProperty('ResellerId')){
                    elem.isMerchant = false 
                }
             elem.idExists = false;
           
             }
         }
         else{
            if(this.checkForUserRole.hasOwnProperty('ResellerId')){
                elem.isMerchant = false 
            }
            elem.idExists = false;
         }
      return elem
      }
    )
    this.dataSource.data = this.tableData
  }

  ngOnChanges(){
      console.log(this.inputStr)
    this.applyFilter(this.inputStr);
    }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  assignPlan(x,roleid?){
 
    this.changesMade  = false;

    if(!x.idExists){
        this.selectedChips.push(x);
      }
      else{
        const ind = this.list.indexOf(x.id);
        if (ind !== -1) {
            this.list.splice(ind, 1)
            this.selectedChips.splice(ind, 1);
        }
      }
//     if(x.alreadyChecked){
//     if(roleid == 4 && this.data.pricingPlanDetail.IsMerchantAssigned){
//         x.idExists = false;
//         this._snackBar.open('Pricing plan cannot be removed from Reseller because it is assigned to Merchants', '', snackBarConfigWarn);
//     }

//     else if(roleid == 3 && this.data.pricingPlanDetail.IsMerchantAssigned){
//         x.idExists = false;
//         this._snackBar.open('Pricing plan cannot be removed from Partner because it is assigned to Resellers', '', snackBarConfigWarn);
//     }

// }
// else{
   
//  }

     
    


  }

  onChange() {
    this.selectedChips = this.data.assignPricingPlan.AssigneeList.filter(
      (obj: any) => {
        return this.selectedAssignee.value.indexOf(obj.id) >= 0
      })
  }

  onRemoved(id: number, index: number) {
    const list = this.selectedAssignee.value;
    const ind = list.indexOf(id);
    if (ind !== -1) {
      list.splice(index, 1)
      this.selectedAssignee.setValue(list);
    }
    this.selectedChips.splice(index, 1);
  }

  assignPricingPlan() {
    const obj = {
      PricingPlanId: this.data.assignPricingPlan.PricingPlanID,
      UserRoleId: this.data.assignPricingPlan.UserRoleId
    };
    let assignedPricingPlan = [];
    (this.selectedChips.length)?
     assignedPricingPlan = this.selectedChips.map(item => {
       item.EntityId = item.id;
       item.PricingPlanId = ''
       return item = {...item, ...obj};
      }
      ) : 
      assignedPricingPlan.push(obj);

    this._pricingPlanService.assignPricingPlan(assignedPricingPlan)
      .then((res: any) => {
        if (res && !res.StatusCode) {
          if(this.initiallength.length < this.selectedChips.length){
            this._snackBar.open('Pricing Plan has been assigned successfully!', '', snackBarConfig);
            this._slidingPanelService.getSidebar('slidePanel', 'AssigneeDialogComponent',this.data).toggleOpen();
            this._slidingPanelService.setSlidingPanelStatus('assignPricingPlan');
           
          
        }else{
            this._snackBar.open('Pricing Plan has been unassigned successfully!', '', snackBarConfig);
            this._slidingPanelService.getSidebar('slidePanel', 'AssigneeDialogComponent',this.data).toggleOpen();
            this._slidingPanelService.setSlidingPanelStatus('unAssignPricingPlan');
           
        }
        this.closedForms.emit(true);
        } else {
          this._snackBar.open('Pricing Plan has not been assigned yet', '', snackBarConfigWarn);

        }
      }).catch((err: HttpErrorResponse) => (console.log));

  }

  closesliding(): void{
    this._slidingPanelService.getSidebar('slidePanel', 'AssigneeDialogComponent',this.data).toggleOpen();
  }
  closeSlidingPanel(): void {
    if(!this.changesMade ){ 
      const dialogRef = this._dialog.open(FuseConfirmDialogComponent, {width: '550px'});
          dialogRef.componentInstance.data={
            title: "Confirmation",
            message:"The changes you have made will be lost. Are you sure you want to cancel ?"
          }
  dialogRef.afterClosed().subscribe((result)=>{
    if(result){
      this._slidingPanelService.getSidebar('slidePanel', 'AssigneeDialogComponent',this.data).toggleOpen();
      this.closedForms.emit(true);
    }
  })
  }
else{
    this._slidingPanelService.getSidebar('slidePanel', 'AssigneeDialogComponent',this.data).toggleOpen();
    this.closedForms.emit(true);
  }
  }



}
