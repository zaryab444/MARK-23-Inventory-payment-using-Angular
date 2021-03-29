import { Component, OnInit, ViewChild, Input, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { takeUntil, take } from 'rxjs/operators';
import { UserConfigService } from '@fuse/services/user.config.service';

@Component({
  selector: 'app-select-search-dropdown',
  templateUrl: './select-search-dropdown.component.html',
  styleUrls: ['./select-search-dropdown.component.scss']
})
export class SelectSearchDropdownComponent implements OnInit {


  /** control for the selected entity */
  public entityCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword */
  public entityFilterCtrl: FormControl = new FormControl();

  /** list of entities filtered by search keyword */
  public filteredEntities: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public userType: any;
  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
  public selectedUser;
  private _unsubscribeAll: Subject<any>;

  /** Subject that emits when the component has been destroyed. */
  private _onDestroy = new Subject<void>();
    EntityId: any;
  @Input() listtype :any ;
  @Input() authrole :any ;
  entity: any;
  @Input()  data: any;
  @Input() editpartner: any;;

  @Output() sendID:EventEmitter<any> =new EventEmitter<any>();
  userType1: boolean;

  /**
    * Constructor
    * @param {UserConfigService} _userConfigService
    */
   
  constructor(
    private readonly _cdref: ChangeDetectorRef,
    private readonly _userConfigService: UserConfigService,
  ) { 
    
  }

  ngOnInit(): void {
    // listen for search field value changes
    // this._cdref.detectChanges();
    if(this.data){
      this.filteredEntities.next(this.data.slice());
      // console.log(this.editpartner);
      }
    this.entityFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterEntities();
      });
      this.userType =   this._userConfigService.loggedInUser.UserRoleId;
   //   this.selectedUser = this.editpartner;
  }
ngAfterViewInit(){
  if (this.userType == this.authrole && this.authrole !== undefined) {
let obj = (this.listtype == "merchant") ?
    { MerchantId : this.data[0]?.MerchantId} : { PartnerId : this.data[0]?.PartnerId} 
    this.selectedUser = (this.listtype == "merchant") ? obj.MerchantId : obj.PartnerId;
    this.sendID.emit(this.selectedUser); 
  }
  if(this.editpartner){
    this.selectedUser = this.editpartner;
  }
 
}
  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  setEntityId(val){
      this.sendID.emit(val); 
  }
ngOnchanges(){
  if(this.editpartner){
    this.selectedUser = this.editpartner;
  }
}

  private filterEntities() {
    if (!this.data) {
      return;
    }
    // get the search keyword
    let search = this.entityFilterCtrl.value;
    if (!search) {
      this.filteredEntities.next(this.data.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the entitys
   if(this.listtype =='merchant'){
    this.filteredEntities.next(
        this.data.filter(entity => entity.MerchantAccountSetup?.MerchantUserName != null && entity.MerchantAccountSetup?.MerchantUserName.toLowerCase().toString().indexOf(search) > -1)
      );
   }
   else if(this.listtype == 'partner'){
    this.filteredEntities.next(
        this.data.filter(entity => entity.PartnerName != null && entity.PartnerName.toLowerCase().toString().indexOf(search) > -1)
      );
   }
    
  }
}
