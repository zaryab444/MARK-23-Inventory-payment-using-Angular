
import { Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, EventEmitter, Inject, Input, OnChanges, OnInit, Output, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserConfigService } from '@fuse/services/user.config.service';
import { PartnerService } from 'app/main/pages/partner/partner.service';
import { snackBarConfigWarn } from 'constants/globalFunctions';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseConfigService } from '@fuse/services/config.service';
import { environment } from 'environments/environment';
import { DOCUMENT } from '@angular/common';
import { SettingService } from '../../settings/settings.service';
import * as globalConfig from '../../../../../constants/globalFunctions';
import { DomSanitizer } from '@angular/platform-browser';
import { AppComponent } from 'app/app.component';
@Component({
  selector: 'app-plg-form',
  templateUrl: './plg-form.component.html',
  styleUrls: ['./plg-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PlgFormComponent implements OnInit, OnChanges {
  public fuseConfig: any;
  private plgDetail: any = {}
  public plgManagmentForm: FormGroup;
  @ViewChild('renderingContainer', { read: ViewContainerRef }) container: ViewContainerRef;
  @Output() submitForm = new EventEmitter<any>();
  private componentRef: ComponentRef<any>;
  public partners: any[] = [];
  public plg: any[] = [];
  private _unsubscribeAll: Subject<any>;
  public logoImage: any = {};
  public splashScreenImage: any = {};
  public FaviconImage: any = {};
  @Input() plgDetails: any = null;
  public themeSettings : any;
 
  public urlValidate = /^(?:http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;


  /**
   * Constructor
   *
   * @param {FormBuilder} _formBuilder
   * @param {PartnerService} _partnerService
    * @param {UserConfigService} _userConfigService
    * @param {ComponentFactoryResolver} _resolver
   */
  constructor(private readonly _partnerService: PartnerService,
    @Inject(DOCUMENT) private document: any,
    private readonly _userConfigService: UserConfigService,
    private readonly _resolver: ComponentFactoryResolver,
    private readonly _formBuilder: FormBuilder,
    private readonly _snackBar: MatSnackBar,
    private readonly _settingService: SettingService,
    private readonly _fuseConfigService: FuseConfigService,
    private _sanitizer: DomSanitizer,
    private _appComp: AppComponent
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.createPlgManagementForm();
    // this._userConfigService.userModeChange
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe(() =>  this.getPlgSettings()
    //   )
    this.getPartners()
    // Subscribe to the form value changes
    this.plgManagmentForm.valueChanges
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        if(this.plgManagmentForm.value.colorTheme != '') {
         this.themeSettings = JSON.parse(localStorage.getItem('ThemeSettings'));
         this.themeSettings.colorTheme = this.plgManagmentForm.value.colorTheme;
        //  this._appComp.settingThemeColorForDashboardGraphs(this.themeSettings.colorTheme);
         localStorage.removeItem('ThemeSettings');
         localStorage.setItem('ThemeSettings', JSON.stringify(this.themeSettings));
         
        }
        this._fuseConfigService.config = config;
      });

  }
  ngOnChanges() {
    if(this.plgDetails) {
      this.getPartners()
       this.plgManagmentForm && this.plgManagmentForm.patchValue(this.plgDetails);
      if(this.plgManagmentForm && this.plgManagmentForm.invalid) 
      {
        globalConfig.validateAllFormFields(this.plgManagmentForm)
      }
      this.patchImage(this.plgDetails);
    }
  }
  getPlgSettings() {
    const obj = this._userConfigService.getUserMode()
    if(obj && obj.UserRoleId != 1) {
      this._settingService.getPlgManager(obj)
      .then((res: any) => {
          if (res && !res.StatusCode) {
            this.plgDetail = res.Response.pop();
             if(obj && obj.UserRoleId != 1) {
               this.plgManagmentForm.patchValue(res.Response.pop());
               this.patchImage(this.plgDetail)
             }
         
          } else {
            this._snackBar.open(res.StatusMessage, '', snackBarConfigWarn);
          }
      }) 
    } else {
      return
    }
  
}
  patchImage(value) {
    if(value.logoImageUrl) {
      if(environment.mentom == true || environment.dev == true) {
        this.logoImage.FilePath = `${environment.apiURL.split('api/').shift()}${'api/'}${value.logoImageUrl.split("~/").pop()}`;
      } else {
        this.logoImage.FilePath = `${environment.apiURL.split('api/').shift()}${value.logoImageUrl.split("~/").pop()}`;
      } 
    }
    if(value.splashScreenImageUrl) {
      if(environment.mentom == true || environment.dev == true) {
        this.splashScreenImage.FilePath = `${environment.apiURL.split('api/').shift()}${'api/'}${value.splashScreenImageUrl.split("~/").pop()}`;
      } else {
        this.splashScreenImage.FilePath = `${environment.apiURL.split('api/').shift()}${value.splashScreenImageUrl.split("~/").pop()}`;
      }
    }
  }
  createPlgManagementForm(): void { 

    this.plgManagmentForm = this._formBuilder.group({
      id: [0, Validators.required],
      DomainName: ['', [Validators.required,Validators.pattern(this.urlValidate)]],
      Phone: [''],
      Email:['', Validators.email],
      SupportWebUrl:[''],
      colorTheme: [''],
      customScrollbars: [true, Validators.required],
      PartnerID: ['', Validators.required],
      layout: this._formBuilder.group({
        style: ['vertical-layout-1'],
        width: ['fullwidth'],
        navbar: this._formBuilder.group({
          primaryBackground: ['fuse-white-500'],
          secondaryBackground: ['fuse-white-500'],
          folded: [false, Validators.required],
          hidden: [false, Validators.required],
          position: ['left'],
          variant: ['vertical-style-1']
        }),
        toolbar: this._formBuilder.group({
          background: ['fuse-white-500'],
          customBackgroundColor: [true, Validators.required],
          hidden: [false, Validators.required],
          position: ['below-fixed']
        }),
        footer: this._formBuilder.group({
          background: [''],
          customBackgroundColor: [false, Validators.required],
          hidden: [true, Validators.required],
          position: ['']
        }),
        sidepanel: this._formBuilder.group({
          hidden: [false, Validators.required],
          position: ['right']
        })
      })
    })
  }
  onFileSelect(event, value): any {
    if (event.rejectedFiles.length) {
      let rejectedFile = event.rejectedFiles.pop();
      if (rejectedFile.reason == 'size') {
        this._snackBar.open('This file exceeds the maximum size limit of 5MB', '', snackBarConfigWarn);
        return;
      }
      else if (rejectedFile.reason == 'type' && value != 'FaviconImage') {
        this._snackBar.open('Only files with the following extensions are allowed: png jpg jpeg', '', snackBarConfigWarn);
        return;
      }
      else if (rejectedFile.reason == 'type' && value == 'FaviconImage') {
        this._snackBar.open('Only files with the following extension is allowed: ico', '', snackBarConfigWarn);
        return;
      }
    } else {
      if (value == 'logoImage') {
        this.logoImage = event.addedFiles.pop();
        this.convertFile(this.logoImage, value)
      } else if (value == 'splashScreenImage') {
        this.splashScreenImage = event.addedFiles.pop();
        this.convertFile(this.splashScreenImage, value)
      } else if (value == 'FaviconImage') {
        this.FaviconImage = event.addedFiles.pop();
        this.convertFile(this.FaviconImage, value)
      }
    }
  }
  async convertFile(file, value?) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (value == 'logoImage') {
        this.logoImage.filename = file.name;
        this.logoImage.filetype = file.type;
        this.logoImage.fileextension = file.type;
        this.logoImage.value = (reader as any).result.split(',').pop();
      } else if (value == 'splashScreenImage') {
        this.splashScreenImage.filename = file.name;
        this.splashScreenImage.filetype = file.type;
        this.splashScreenImage.fileextension = file.type;
        this.splashScreenImage.value = (reader as any).result.split(',').pop();
      } else if (value == 'FaviconImage') {
        this.FaviconImage.filename = file.name;
        this.FaviconImage.filetype = file.type;
        this.FaviconImage.fileextension = file.type;
        this.FaviconImage.value = (reader as any).result.split(',').pop();
        this.FaviconImage.value = this._sanitizer.bypassSecurityTrustUrl('data:image/x-icon;base64,'+ this.FaviconImage.value)
        console.log(this.FaviconImage);
      }

    }
  }
  getPartners(): void {
    this._partnerService.partnerList(this._userConfigService.getUserMode())
      .then((res: any) => {
        if (res && !res.StatusCode) {
          if (res.Response && res.Response.Partners.length) {
            this.partners = res.Response.Partners;
          }
        }
      });
  }
  // onSelection(partner) {
  //   this._settingService.getPlgManager({PartnerID:partner.value}).subscribe((res:any) => {
  //    if(res) {
  //      console.log('res', res);
  //    }
  //   })
  // }
  onFileRemove(value) {
    if (value == 'splashScreenImage') {
      this.splashScreenImage = {};
    } else if (value == "logoImage") {
      this.logoImage = {};
    } else if (value == "FaviconImage") {
      this.FaviconImage = {};
    }
  }
  saveLayouts() {
    if (this.plgManagmentForm.valid) {
      const obj = {
        logoImage: { ...this.logoImage },
        splashScreenImage: { ...this.splashScreenImage },
        FaviconImage: { ...this.FaviconImage },
        ...this.plgManagmentForm.value,
      }
      if(obj.colorTheme == '') {
        obj.colorTheme = 'theme-default';
      }
      console.log('obj', obj);
      this.submitForm.emit(obj);
    } else {
      globalConfig.validateAllFormFields(this.plgManagmentForm);
    }
  }
}

