import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { FuseConfigService } from '@fuse/services/config.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { navigation } from 'app/navigation/navigation';
import { Router } from '@angular/router';
import { UserConfigService } from '@fuse/services/user.config.service';
import { authRole } from 'constants/globalFunctions';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AppComponent } from 'app/app.component';

@Component({
    selector     : 'toolbar',
    templateUrl  : './toolbar.component.html',
    styleUrls    : ['./toolbar.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ToolbarComponent implements OnInit, OnDestroy
{
    public userName: string;
    public toggleHierarchy: boolean = false;
    horizontalNavbar: boolean;
    rightNavbar: boolean;
    hiddenNavbar: boolean;
    languages: any;
    navigation: any;
    selectedLanguage: any;
    userStatusOptions: any[];
     AppsIcons: any[];
    // Private
    private _unsubscribeAll: Subject<any>;
    public userType: any;
    public authRolemerchant = authRole.merchant;

    /**
     * Constructor
     *
     * @param {UserConfigService} _userConfigService
     * @param {FuseConfigService} _fuseConfigService
     * @param {Router} _router
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {TranslateService} _translateService
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _fuseSidebarService: FuseSidebarService,
        private _translateService: TranslateService,
        private readonly _userConfigService: UserConfigService,
        private readonly _router: Router,
        private readonly _http: HttpClient,
        private readonly _appComp: AppComponent
    )
    {
        // Set the defaults
        this.userStatusOptions = [
            {
                title: 'Online',
                icon : 'icon-checkbox-marked-circle',
                color: '#4CAF50'
            },
            {
                title: 'Away',
                icon : 'icon-clock',
                color: '#FFC107'
            },
            {
                title: 'Do not Disturb',
                icon : 'icon-minus-circle',
                color: '#F44336'
            },
            {
                title: 'Invisible',
                icon : 'icon-checkbox-blank-circle-outline',
                color: '#BDBDBD'
            },
            {
                title: 'Offline',
                icon : 'icon-checkbox-blank-circle-outline',
                color: '#616161'
            }
        ];
        this.AppsIcons = [
            {
                title: 'Invoice',
                icon : 'invoice',
            },
            {
                title: 'Customer',
                icon : 'customer',
            },
            {
                title: 'Settings',
                icon : 'settings',
            },
            {
                title: 'Products',
                icon : 'inventory',
              
            },
            {
                title: 'Employees',
                icon : 'employees',
            
            },
            {
                title: 'QB',
                icon : 'qbfinancials',
            
            }
        ];

        this.languages = [
            {
                id   : 'en',
                title: 'English',
                flag : 'us'
            },
            {
                id   : 'tr',
                title: 'Turkish',
                flag : 'tr'
            }
        ];

        this.navigation = navigation;

        // Set the private defaults
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
        // Subscribe to the config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((settings) => {
                this.horizontalNavbar = settings.layout.navbar.position === 'top';
                this.rightNavbar = settings.layout.navbar.position === 'right';
                this.hiddenNavbar = settings.layout.navbar.hidden === true;
            });
            //set userName

        this.userName = this._userConfigService.loggedInUser.Username
        this.userType =   this._userConfigService.loggedInUser.UserRoleId
        // Set the selected language from default languages
        this.selectedLanguage = _.find(this.languages, {id: this._translateService.currentLang});
    }

    logout(): void{
        const theme = localStorage.getItem('ThemeSettings');
        const themeDefault = localStorage.getItem('defaultThemeColor');
        const themeDefaultLayout = localStorage.getItem('defaultThemeLayout');
        localStorage.clear();
        localStorage.setItem('ThemeSettings',theme);
        localStorage.setItem('defaultThemeColor',themeDefault);
        localStorage.setItem('defaultThemeLayout', themeDefaultLayout);
        const hostname = window && window.location && window.location.origin;

        this.getPlgSettings(environment.apiURL, hostname).then((res: any) => {
            if (res.Response && res.Response.length) {
                localStorage.setItem('ThemeSettings', JSON.stringify(res.Response[0]));
                localStorage.setItem('defaultThemeColor', JSON.stringify(res.Response[0].colorTheme));
                localStorage.setItem('defaultThemeLayout', JSON.stringify(res.Response[0].layout));
                this._appComp.settingThemeColorForDashboardGraphs(res.Response[0].colorTheme);
                this._router.navigate(['/login']);
            } else {
                this._router.navigate(['/login']);
                localStorage.setItem('defaultThemeColor', JSON.stringify('theme-default'));
                // localStorage.setItem('defaultThemeLayout', JSON.stringify(res.Response[0].layout));
            }
        })
       
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

    toggleHierarchyTree(){
        this.toggleHierarchy = true;
    }
    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebarOpen(key): void
    {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

    /**
     * Search
     *
     * @param value
     */
    search(value): void
    {
        // Do your search here...
        console.log(value);
    }

    /**
     * Set the language
     *
     * @param lang
     */
    setLanguage(lang): void
    {
        // Set the selected language for the toolbar
        this.selectedLanguage = lang;

        // Use the selected language for translations
        this._translateService.use(lang.id);
    }
    // routetoverfication(){
    //     this._router.navigate(['/twofactor']);
    // }
}
