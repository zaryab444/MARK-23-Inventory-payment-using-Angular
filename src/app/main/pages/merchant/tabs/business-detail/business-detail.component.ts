import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { locationConfig, validator } from '../../../../../../constants/globalFunctions';

@Component({
  selector: 'app-business-detail',
  templateUrl: './business-detail.component.html',
  styleUrls: ['./business-detail.component.scss']
})
export class BusinessDetailComponent implements OnInit, AfterViewInit, OnChanges {
  idparam : any;
  public locationObj = locationConfig;
  public validatorObj = validator; 
    
  public businessDetailForm: FormGroup;
  @Input() businessDetail: any = null;
  @Output() stepTwo = new EventEmitter<any>();
  @Output() stepTwoSaveExit = new EventEmitter<any>();
  

  /**
   * Constructor
   *
   * @param {FormBuilder} _formBuilder
   */
  constructor(
    private _formBuilder: FormBuilder,
    private _route : ActivatedRoute
) { }


  ngOnInit(): void {
    this.createBusinessDetailForm();
    this.idparam = this._route.snapshot.paramMap.get('id');

  }

  createBusinessDetailForm(): void{
    this.businessDetailForm = this._formBuilder.group({
      BusinessId: [0, Validators.required],
      BusinessType: ['', Validators.required],
      Descriptor:  [''],
      TaxIDNo:  [''],
      YearsInBusiness:  [''],
      WebSite: ['', Validators.required],
      AcceptCreditCards: ['', Validators.required],
      BusinessPhone:  ['', Validators.required],
      Fax:  [''],
      BusinessAddress:  [''],
      BusinessAddress1:  [''],
      BusinessCity:  [''],
      BusinessState:  [''],
      BusinessZip:  ['', Validators.maxLength(validator.zipMaxLength)]
  });
  }
  ngOnChanges(): void{
    if(this.businessDetail){
      if(!this.businessDetailForm){
        this.createBusinessDetailForm();
        this.stepTwo.emit(this.businessDetailForm);
      }
      this.businessDetailForm.patchValue(this.businessDetail);
    }
  }
  ngAfterViewInit(): void {
    this.stepTwo.emit(this.businessDetailForm);
  }
  saveAndexit(){
    this.stepTwo.emit(this.businessDetailForm);
    this.stepTwoSaveExit.emit(true);
  }
}
