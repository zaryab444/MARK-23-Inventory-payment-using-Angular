import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { validator, snackBarConfiglogin, snackBarConfigWarn, validateAllFormFields } from '../../../../constants/globalFunctions';
import { AuthenticationService } from '../authentication.service';
import { FuseConfigService } from '@fuse/services/config.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { AppComponent } from 'app/app.component';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LoginComponent implements OnInit {
    public appInfo = environment;
    fuseConfig: any;
    public loginForm: FormGroup;
    public loggedIn: boolean = false;
    public themeSettings: any;
    public logo: any;
    private _unsubscribeAll: Subject<any>;
    /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     * @param {AuthenticationService} _authenticationService
     * @param {Router} _router
     * @param {MatSnackBar} _snackBar
     */
    constructor(
        @Inject(DOCUMENT) private document: any,
        private readonly _formBuilder: FormBuilder,
        private readonly _authenticationService: AuthenticationService,
        private readonly _router: Router,
        private readonly _snackBar: MatSnackBar,
        private _fuseConfigService: FuseConfigService,
        private readonly _http: HttpClient,
        private readonly _appComp : AppComponent
    ) { 
        this._unsubscribeAll = new Subject();
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.createLoginForm();
        this.themeSettings = JSON.parse(localStorage.getItem('ThemeSettings'));
        if (this.themeSettings && this.themeSettings.logoImageUrl != null) {
            this.configurationRetriver(this.themeSettings);
            this.checkForEnvironment(this.themeSettings);
        } else {
            const hostname = window && window.location && window.location.origin;
            this.getPlgSettings(environment.apiURL, hostname).then((res: any) => {
                if (res.Response && res.Response.length) {
                    localStorage.setItem('defaultThemeColor', JSON.stringify(res.Response[0].colorTheme))
                    localStorage.setItem('ThemeSettings', JSON.stringify(res.Response[0]));
                    localStorage.setItem('defaultThemeLayout', JSON.stringify(res.Response[0].layout));
                    this.themeSettings = res.Response[0]
                    this.checkForEnvironment(this.themeSettings);
                    this._appComp.settingThemeColorForDashboardGraphs(this.themeSettings.colorTheme);
                    this._fuseConfigService.setConfig(res.Response[0])
                    this._fuseConfigService.config = res.Response[0];
                    this.fuseConfig = res.Response[0];
                    this.configurationRetriver(res.Response[0]);
                } else {
                    this.logo = 'assets/images/'+`${this.appInfo.assetPathName}`+'-logos/logo.svg';
                    localStorage.setItem('defaultThemeColor', JSON.stringify('theme-default'))

                }
            });
        }
    }
    checkForEnvironment(themeSettings) {
        if(environment.dev == true) {
            this.logo = `${environment.apiURL.split('api/').shift()}${'api/'}${themeSettings.logoImageUrl.split("~/").pop()}`
        } else {
            this.logo = `${environment.apiURL.split('api/').shift()}${themeSettings.logoImageUrl.split("~/").pop()}`
        }
    }
    createLoginForm() {
        this.loginForm = this._formBuilder.group({
            Username: ['', [Validators.required, Validators.email, Validators.pattern(validator.emailPattern)]],
            Password: ['', Validators.required]
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
    login(): void {
        this.loggedIn = true;
        if (this.loginForm.valid) {
            this._snackBar.open('Signing in', '', snackBarConfiglogin);
            this._authenticationService.signIn(this.loginForm.value).then((res: any)=>{
                if(res && !res.StatusCode){
                    if(!res.Response.IsAccountActive && res.Response.UserRoleId == 2){
                        this._router.navigate(['inactive']);
                       
                    }else
                    {
                        localStorage.setItem('userInfo', JSON.stringify(res.Response));
                        this._router.navigate(['/pages/dashboard']);
                    }

                } else {
                    this.loggedIn = false;
                    this._snackBar.open(res.StatusMessage, '', snackBarConfigWarn);
                }
            }).catch((err: HttpErrorResponse) => (console.log))
        } else {
            validateAllFormFields(this.loginForm)
            this.loggedIn = false;
        }
    }
}
