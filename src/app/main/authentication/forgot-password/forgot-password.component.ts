import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { environment } from 'environments/environment';
import { snackBarConfig, snackBarConfigWarn, validateAllFormFields, validator } from '../../../../constants/globalFunctions';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from '../authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseConfigService } from '@fuse/services/config.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
@Component({
    selector     : 'forgot-password',
    templateUrl  : './forgot-password.component.html',
    styleUrls    : ['./forgot-password.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ForgotPasswordComponent implements OnInit
{
    public forgotPasswordForm: FormGroup;
    public appInfo = environment;
    public themeSettings: any;
    private _unsubscribeAll: Subject<any>;
    public logo: any;
    fuseConfig: any;
    /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     * @param {AuthenticationService} _authenticationService
     */
    constructor(
        @Inject(DOCUMENT) private document: any,
        private _formBuilder: FormBuilder,
        private readonly _router: Router,
        private readonly _authenticationService: AuthenticationService,
        private _snacksBar: MatSnackBar,
        private _fuseConfigService: FuseConfigService,
        private readonly _http: HttpClient
    )
    {
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.themeSettings = JSON.parse(localStorage.getItem('ThemeSettings'));
        this.themeSettings = JSON.parse(localStorage.getItem('ThemeSettings'));
        if (this.themeSettings && this.themeSettings.logoImageUrl != null) {
            this.configurationRetriver(this.themeSettings);
            this.checkForEnvironment(this.themeSettings);
        } else {
            const hostname = window && window.location && window.location.origin;
            this.getPlgSettings(environment.apiURL, hostname).then((res: any) => {
                if (res.Response && res.Response.length) {
                    localStorage.setItem('ThemeSettings', JSON.stringify(res.Response[0]));
                    localStorage.setItem('defaultThemeColor', JSON.stringify(res.Response[0].colorTheme))
                    localStorage.setItem('defaultThemeLayout', JSON.stringify(res.Response[0].layout))
                    this.themeSettings = res.Response[0]
                    this.checkForEnvironment(this.themeSettings);
                    this._fuseConfigService.setConfig(res.Response[0])
                    this._fuseConfigService.config = res.Response[0];
                    this.fuseConfig =  res.Response[0];
                    this.configurationRetriver(res.Response[0]);
                } else {
                    this.logo = 'assets/images/'+`${this.appInfo.assetPathName}`+'-logos/logo.svg';
                    localStorage.setItem('defaultThemeColor', JSON.stringify('theme-default'))
                }
            });
        }
        this.forgotPasswordForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email, Validators.pattern(validator.emailPattern)]]
        });
    }
    getPlgSettings(url: any, data: any) {
        let response: any
        const updateUrl = url + 'Setting/GetPLG'
        const obj = {
            DomainName: data
        }
        const promise = new Promise((resolve, reject) => {
            this._http.post(updateUrl, obj || {})
                .toPromise()
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
        return promise;
    }
    configurationRetriver(value?) {
        // Subscribe to config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {
                if (environment.mentom == true || environment.surfside == true || environment.wholesale == true || environment.magic == true) {
                    this.fuseConfig = value;
                    this.fuseConfig.colorTheme = environment.themeName;
                } else {
                    this.fuseConfig = value;
                    this.fuseConfig.colorTheme = value.colorTheme;
                }
                // Boxed
                if (this.fuseConfig.layout.width === 'boxed') {
                    this.document.body.classList.add('boxed');
                }
                else {
                    this.document.body.classList.remove('boxed');
                }

                // Color theme - Use normal for loop for IE11 compatibility
                for (let i = 0; i < this.document.body.classList.length; i++) {
                    const className = this.document.body.classList[i];

                    if (className.startsWith('theme-')) {
                        this.document.body.classList.remove(className);
                    }
                }

                this.document.body.classList.add(this.fuseConfig.colorTheme);
            });
    }
    checkForEnvironment(themeSettings) {
        if(environment.dev == true) {
            this.logo = `${environment.apiURL.split('api/').shift()}${'api/'}${themeSettings.logoImageUrl.split("~/").pop()}`
        } else {
            this.logo = `${environment.apiURL.split('api/').shift()}${themeSettings.logoImageUrl.split("~/").pop()}`
        }
    }

    resetPassword(): void{
        if (this.forgotPasswordForm.invalid){
            validateAllFormFields(this.forgotPasswordForm);
        }
        else {
            this._authenticationService.resetPassword(this.forgotPasswordForm.value)
            .then((res: any) => {
                if (res && !res.StatusCode) {
                this._router.navigate(['login']);
                this._snacksBar.open('An email has been sent. Follow the directions in email to reset your password', '', snackBarConfig);
               } else {
                this._snacksBar.open('The email address does not exist in our system', '', snackBarConfigWarn);
               } 
              }).catch((err: HttpErrorResponse)=>(console.log));
        }
    }




}
