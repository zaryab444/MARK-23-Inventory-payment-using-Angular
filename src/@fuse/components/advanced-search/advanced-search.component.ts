import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatMenu } from '@angular/material/menu';
import { UserConfigService } from '@fuse/services/user.config.service';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss'],
  encapsulation: ViewEncapsulation.None,
  exportAs: 'menuInOtherComponent'
})
export class AdvancedSearchComponent implements OnInit {
  @Input() data: any;
  @Input() page: any;
  @Output() submitForm = new EventEmitter<any>();
  public SearchForm: FormGroup;
  public selected: any;

  @ViewChild(MatMenu, { static: true }) menu: MatMenu;
  public checkForUserRole: any;
  /**
  * Constructor
  * @param {FormBuilder} _formBuilder
  */
  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _userConfigService: UserConfigService,
  ) {
  }

  ngOnInit(): void {
    this.SearchForm = this._formBuilder.group({
      MatMenuFields: this._formBuilder.array([])
    });
    if(this.data) {
    this.getMatMenuFields(this.data);
    }
   
  }
 

  getMatMenuFields(data: any) {
     
    const matMenuFields = this.SearchForm.controls.MatMenuFields as FormArray;
    data.forEach((item: any) => {
      let obj : {}
      if (item.option) {
        obj = {
          [item.ControlName]: "All"
        }
      }else{
       obj = {
          [item.ControlName]: ''
        }
      }
      
      const formGroup = this._formBuilder.group(obj);
      matMenuFields.push(formGroup);
    });
  }
  submit() {
    this.checkForUserRole = this._userConfigService.getUserMode();
    const searchingfields = this.SearchForm.value.MatMenuFields.reduce(((r, c) => Object.assign(r, c)), {});
    const searchfields = Object.entries(searchingfields).reduce((a, [k, v]) =>
      ((v !== '') ? (a[k] = v, a) : a), { ...this.checkForUserRole })
    this.submitForm.emit(searchfields);
  }
  resetForm(){
    this.SearchForm.reset();
    let obj = [];
   
    if (this.data && this.page == 'merchantPage') {
      obj  = [
       { Status: 'All' },
       { MerchantUserName: '' },
       { ResellerName: '' },
       { Email: '' },
       { PricingTitle: '' }
    ]
    this.SearchForm.value.MatMenuFields = obj;
    this.SearchForm.controls['MatMenuFields'].patchValue(obj);
}
    if (this.data && this.page == 'transactionPage') {
           obj  = [
            { Status: 'All' },
            { TransactionType: 'All' },
            { TransactionId: '' },
            { CardholderName: '' },
            { Last4digit: '' },
            { Amount: '' },
          
         ]
         this.SearchForm.value.MatMenuFields = obj;
         this.SearchForm.controls['MatMenuFields'].patchValue(obj);
    }
    if(this.data && this.page == 'userPage'){
      obj = [
        { UserRoleID: 'All' },
        { Status: 'All' },
        { FirstName: '' },
        { LastName: '' },
        { Username: '' },
        { Phone: '' }
      ]
      this.SearchForm.value.MatMenuFields = obj;
      this.SearchForm.controls['MatMenuFields'].patchValue(obj);
    }
    this.submit();

  }
  stopPropagation($event) {

    if ($event.toElement.textContent !== " Search ") {
      $event.stopPropagation();
    }

  }
}