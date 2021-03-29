import { Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, OnDestroy, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { navigation } from 'app/navigation/navigation';
import {PartnerCreateComponent} from '../../../main/pages/partner/partner-create/partner-create.component'
import { ResellerCreateComponent } from '../../../main/pages/reseller/reseller-create/reseller-create.component';
import { PricingPlanCreateComponent } from '../../../main/pages/pricing-plan/pricing-plan-create/pricing-plan-create.component';
import { PricingPlanEditComponent } from '../../../main/pages/pricing-plan/pricing-plan-edit/pricing-plan-edit.component';
import { UserCreateComponent } from '../../../main/pages/user/user-create/user-create.component';
import { AssigneeDialogComponent } from '../../../../@fuse/components/assignee-dialog/assignee-dialog.component'
import { UserEditComponent } from 'app/main/pages/user/user-edit/user-edit.component';
import { DisputeFormComponent } from 'app/main/pages/disputes/dispute-form/dispute-form.component'
@Component({
    selector     : 'vertical-layout-1',
    templateUrl  : './layout-1.component.html',
    styleUrls    : ['./layout-1.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class VerticalLayout1Component implements OnInit, OnDestroy
{
    @ViewChild('renderingComponent', { read: ViewContainerRef, static: false }) container: ViewContainerRef;
    private componentRef: ComponentRef<any>;
    public isClosed:boolean

    fuseConfig: any;
    navigation: any;

    // Private
    private _unsubscribeAll: Subject<any>;
    themeSettings: any;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private readonly _resolver: ComponentFactoryResolver
    )
    {
        // Set the defaults
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
        this.themeSettings = JSON.parse(localStorage.getItem('ThemeSettings'));
        // Subscribe to config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {
                // if(this.themeSettings) {
                    // this.fuseConfig = this.themeSettings
                // } else {
                    this.fuseConfig = config;
                // }
            });
        window.addEventListener("scroll", this.scroll, true);
    }
     scroll = (event): void => {
        console.log("caca");
        this.detectBottom();
        //handle your scroll here
        //notice the 'odd' function assignment to a class field
        //this is used to be able to remove the event listener
    };
    detectBottom(): void {
        var id = document.getElementById("ele");
        var id2 = document.getElementById("container-3");
        if (id2.offsetHeight + id?.parentElement?.scrollTop >= id.offsetHeight) {
           
            // if (!this.loadedAll) {
            //     this.fetchMore.emit(true);
            // }
        }
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

    renderComponent(value) {
        let factory:ComponentFactory<any>;
        this.container.clear();
        factory = this._resolver.resolveComponentFactory(rendererType[value.componentName]);
        this.componentRef = this.container.createComponent(factory);
        this.componentRef.instance.closedForms && this.componentRef.instance.closedForms.subscribe(res => {
            if (res) {
             this.container.clear();
            }
          })
        if(value.data) {
            this.componentRef.instance.data = value.data;
        }
    }
    checkForClose(value) {
        console.log('value ', value)
    }
}
export const rendererType = {
    PartnerCreateComponent,
    PricingPlanCreateComponent,
    ResellerCreateComponent,
    PricingPlanEditComponent,
    AssigneeDialogComponent,
    UserCreateComponent,
    UserEditComponent,
    DisputeFormComponent
  }