import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { navigation } from 'app/navigation/navigation';
import { environment } from 'environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { SlidingPanelService } from '@fuse/components/sliding-panel/sliding-panel.service';
import { UserConfigService } from '@fuse/services/user.config.service';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    static myapp
    fuseConfig: any;
    navigation: any;

    public hostname = window && window.location && window.location.origin;

    // Private
    private _unsubscribeAll: Subject<any>;
    public plgValue: Promise<any>;
    public themeSettings: any;

    /**
     * Constructor
     *
     * @param {DOCUMENT} document
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseNavigationService} _fuseNavigationService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {FuseSplashScreenService} _fuseSplashScreenService
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     * @param {Platform} _platform
     * @param {TranslateService} _translateService
     */
    constructor(
        @Inject(DOCUMENT) private document: any,
        private _fuseConfigService: FuseConfigService,
        private _fuseNavigationService: FuseNavigationService,
        private _slidingPanelService: SlidingPanelService,
        private _fuseSidebarService: FuseSidebarService,
        private _fuseSplashScreenService: FuseSplashScreenService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _translateService: TranslateService,
        private _platform: Platform,
        private _matIconRegistry: MatIconRegistry,
        private _domSanitizer: DomSanitizer,
        private readonly _userConfigService: UserConfigService,
        private readonly _http: HttpClient
    ) {
        this._matIconRegistry
            .addSvgIcon(
                'no-pricing-plan',
                this._domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/svg/no-pricing-plan.svg')
            )
            .addSvgIcon(
                'no-merchant',
                this._domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/svg/no-merchant.svg')
            )
            .addSvgIcon(
                'no-dispute',
                this._domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/svg/no-dispute.svg')
            )
            .addSvgIcon(
                'no-funding',
                this._domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/svg/no-funding.svg')
            )
            .addSvgIcon(
                'no-partner',
                this._domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/svg/no-partner.svg')
            )
            .addSvgIcon(
                'no-reseller',
                this._domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/svg/no-reseller.svg')
            )
            .addSvgIcon(
                'no-transaction',
                this._domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/svg/no-transaction.svg')
            )
            .addSvgIcon(
                'fraud',
                this._domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/svg/fraud.svg')
            )
            .addSvgIcon(
                'velocity-control',
                this._domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/svg/velocity-control.svg')
            )
            .addSvgIcon(
                'transaction-control',
                this._domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/svg/transaction-control.svg')
            )
            .addSvgIcon(
                'transaction-alert',
                this._domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/svg/transaction-alert.svg')
            )
            .addSvgIcon(
                'charge-back',
                this._domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/svg/charge-back.svg')
            )
            .addSvgIcon(
                'ach',
                this._domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/svg/ach.svg')
            )
            .addSvgIcon(
                'mastercard',
                this._domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/svg/mastercard.svg')
            )
            .addSvgIcon(
                'visa',
                this._domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/svg/visa.svg')
            )
            .addSvgIcon(
                'exportexcel',
                this._domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/svg/exportexcel.svg')
            )
            .addSvgIcon(
                'exportpdf',
                this._domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/svg/exportpdf.svg')
            )
            .addSvgIcon(
                'verification',
                this._domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/svg/verification.svg')
            )
            .addSvgIcon(
                'resetpassword',
                this._domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/svg/resetpassword.svg')
            )
            .addSvgIcon(
                'invoice',
                this._domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/svg/invoice.svg')
            )
            .addSvgIcon(
                'customer',
                this._domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/svg/customer.svg')
            )
            .addSvgIcon(
                'settings',
                this._domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/svg/settings.svg')
            )
            .addSvgIcon(
                'inventory',
                this._domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/svg/inventory.svg')
            )
            .addSvgIcon(
                'employees',
                this._domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/svg/employees.svg')
            ) 
            .addSvgIcon(
                'LastActivity',
                this._domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/svg/useractivity.svg')
            )
            .addSvgIcon(
                'qbfinancials',
                this._domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/svg/qbfinancials.svg')
            );
        // Get default navigation
        this.navigation = navigation;

        // Register the navigation to the service
        this._fuseNavigationService.register('main', this.navigation);

        // Set the main navigation as our current navigation
        this._fuseNavigationService.setCurrentNavigation('main');

        // Add languages
        // this._translateService.addLangs(['en', 'tr']);

        // Set the default language
        // this._translateService.setDefaultLang('en');

        // Set the navigation translations
        // this._fuseTranslationLoaderService.loadTranslations(navigationEnglish, navigationTurkish);

        // Use a language
        // this._translateService.use('en');

        /**
         * ----------------------------------------------------------------------------------------------------
         * ngxTranslate Fix Start
         * ----------------------------------------------------------------------------------------------------
         */

        /**
         * If you are using a language other than the default one, i.e. Turkish in this case,
         * you may encounter an issue where some of the components are not actually being
         * translated when your app first initialized.
         *
         * This is related to ngxTranslate module and below there is a temporary fix while we
         * are moving the multi language implementation over to the Angular's core language
         * service.
         **/

        // Set the default language to 'en' and then back to 'tr'.
        // '.use' cannot be used here as ngxTranslate won't switch to a language that's already
        // been selected and there is no way to force it, so we overcome the issue by switching
        // the default language back and forth.
        /**
         setTimeout(() => {
            this._translateService.setDefaultLang('en');
            this._translateService.setDefaultLang('tr');
         });
         */

        /**
         * ----------------------------------------------------------------------------------------------------
         * ngxTranslate Fix End
         * ----------------------------------------------------------------------------------------------------
         */

        // Add is-mobile class to the body if the platform is mobile
        if (this._platform.ANDROID || this._platform.IOS) {
            this.document.body.classList.add('is-mobile');
        }

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.getPlgSettings(environment.apiURL, this.hostname).then((res: any) => {
            if (res.Response && res.Response.length) {
                localStorage.setItem('defaultThemeColor', JSON.stringify(res.Response[0].colorTheme));
                localStorage.setItem('defaultThemeLayout', JSON.stringify(res.Response[0].layout));
                localStorage.setItem('ThemeSettings', JSON.stringify(res.Response[0]));
                this._fuseConfigService.setConfig(res.Response[0])
                this._fuseConfigService.config = res.Response[0];
                this.fuseConfig = res.Response[0];
                this.configurationRetriver(res.Response[0]);
                this.settingThemeColorForDashboardGraphs(res.Response[0].colorTheme)
            } else {
                this.configurationRetriver()
            }
        });
    }
    public settingThemeColorForDashboardGraphs(value) {
        if (value == 'theme-default') {
            localStorage.setItem('themeColor', JSON.stringify('#039be5'));
            localStorage.setItem('themeTransparentColor', JSON.stringify('#039be599'));  
        } else if(value =='theme-yellow-light') {
            localStorage.setItem('themeColor', JSON.stringify('#fdd835'));
            localStorage.setItem('themeTransparentColor', JSON.stringify('#fdd83599'));     
        } else if (value == 'theme-surfside') {
            localStorage.setItem('themeColor', JSON.stringify('#29ade4'));
            localStorage.setItem('themeTransparentColor', JSON.stringify('#29ade499'));
        } else if (value == 'theme-mentom') {
            localStorage.setItem('themeColor', JSON.stringify('#c41230'));
            localStorage.setItem('themeTransparentColor', JSON.stringify('#c41230b3'));
        } else if (value == 'theme-magic') {
            localStorage.setItem('themeColor', JSON.stringify('#ff0000'));
            localStorage.setItem('themeTransparentColor', JSON.stringify('#ff000099'));
        } else if (value == 'theme-wholesale') {
            localStorage.setItem('themeColor', JSON.stringify('#f7931e'));
            localStorage.setItem('themeTransparentColor', JSON.stringify('#f7931e99'));
        }
    }
    configurationRetriver(value?) {
        // Subscribe to config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {
                this.themeSettings = JSON.parse(localStorage.getItem('ThemeSettings'));
                if (!this.themeSettings) {
                    this.fuseConfig = config;
                    this.fuseConfig.colorTheme = environment.themeName;
                    this.settingThemeColorForDashboardGraphs(environment.themeName)
                } else {
                    this.fuseConfig = this.themeSettings;
                    this.settingThemeColorForDashboardGraphs(this.themeSettings.colorTheme)
                    this.fuseConfig.colorTheme = this.themeSettings.colorTheme;
                    this.fuseConfig.layout = this.themeSettings.layout;
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

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
