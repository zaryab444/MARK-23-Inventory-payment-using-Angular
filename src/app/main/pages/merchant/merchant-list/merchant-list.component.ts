import { HttpErrorResponse } from "@angular/common/http";
import {
    Component,
    ComponentFactory,
    ComponentFactoryResolver,
    ComponentRef,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation,
} from "@angular/core";
import { NoFoundComponent } from "@fuse/components/no-found/no-found.component";
import { UserConfigService } from "@fuse/services/user.config.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { MerchantTableComponent } from "../merchant-table/merchant-table.component";
import { MerchantService } from "../merchant.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import * as globalConfig from "../../../../../constants/globalFunctions";
import { AdvancedSearchComponent } from "@fuse/components/advanced-search/advanced-search.component";
import {
    ExportType,
    MerchantStatus,
} from "../../../../../constants/globalFunctions";
declare const require: any;
const FileSaver = require("file-saver");
@Component({
    selector: "app-merchant-list",
    templateUrl: "./merchant-list.component.html",
    styleUrls: ["./merchant-list.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class MerchantListComponent implements OnInit, OnDestroy {
    @ViewChild("renderingContainer", { read: ViewContainerRef })
    container: ViewContainerRef;
    private componentRef: ComponentRef<any>;
    public merchants: any[] = [];
    public merchantSearchForm: FormGroup;
    private _unsubscribeAll: Subject<any>;
    public globalConfig = globalConfig;
    public MerchantSearchField = [];
    public Exporttypepdf = ExportType.pdf;
    public Exporttypecsv = ExportType.csv;
    public merchStatus = MerchantStatus;
    @ViewChild(AdvancedSearchComponent)
    childComponentMenu: AdvancedSearchComponent;
    public AdvSearch: any;
    /**
     * Constructor
     *
     * @param {MerchantService} _merchantService
     * @param {UserConfigService} _userConfigService
     * @param {ComponentFactoryResolver} _resolver
     */

    constructor(
        private readonly _formBuilder: FormBuilder,
        private readonly _merchantService: MerchantService,
        private readonly _userConfigService: UserConfigService,
        private readonly _resolver: ComponentFactoryResolver
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.MerchantSearchField = [
            {
                label: "Status",
                ControlName: "Status",
                option: [
                    {
                        value: "All",
                        text: "All",
                    },
                    {
                        value: this.merchStatus.Rejected,
                        text: "Rejected",
                    },
                    {
                        value: this.merchStatus.Restricted,
                        text: "Restricted",
                    },

                    {
                        value: this.merchStatus.Complete,
                        text: "Complete",
                    },
                    {
                        value: this.merchStatus.InActive,
                        text: "InActive",
                    },
                    {
                        value: this.merchStatus.RestrictedSoon,
                        text: "RestrictedSoon",
                    },
                ],
            },
            { label: "Company Name ", ControlName: "MerchantUserName" },
            { label: "Reseller Name ", ControlName: "ResellerName" },
            { label: "Email ", ControlName: "Email" },
            { label: "Pricing Title ", ControlName: "PricingTitle" },
        ];
    }

    ngOnInit(): void {
        this._userConfigService.userModeChange
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => this.getMerchants());
    }
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this.componentRef && this.componentRef.destroy();
    }
    renderingComponent(type, data?) {
        const factory: ComponentFactory<any> = this._resolver.resolveComponentFactory(
            type
        );
        this.container.clear();
        this.componentRef = this.container.createComponent(factory);
        this.componentRef.instance.data = data;
        this.componentRef.instance.ExportCall.subscribe((res: any) => {
            this.getMerchants(res);
        });
    }

    getMerchants(value?) {
        let obj;
        if (value?.IsExport) {
            obj = {
                ...this._userConfigService.getUserMode(),
                ...value,
                ...this.AdvSearch,
            };
        } else if (this.AdvSearch?.search) {
            delete this.AdvSearch.UserRoleId;
            delete this.AdvSearch.EntityId;
            delete this.AdvSearch.AdminId;
            delete this.AdvSearch.PartnerId;
            delete this.AdvSearch.ResellerId;
            delete this.AdvSearch.MerchantId;
            obj = {
                ...this._userConfigService.getUserMode(),
                ...this.AdvSearch,
            };
        } else {
            obj = {
                ...this._userConfigService.getUserMode(),
                RecordLimit: 100,
                PageNo: 1,
            };
        }
        this._merchantService
            .merchantList(obj)
            .then((res: any) => {
                if (res && !res.StatusCode) {
                    if (
                        res.Response.Merchants &&
                        res.Response.Merchants.length
                    ) {
                        this.merchants = res.Response.Merchants;
                        if (res.Response.FileUrl) {
                            let url = res.Response.FileUrl;
                            window.open(url, "_blank");
                        }
                        this.renderingComponent(MerchantTableComponent, {
                            merchants: this.merchants,
                            merchantCount: res.Response.TotalCount,
                        });
                    } else {
                        this.renderingComponent(NoFoundComponent, {
                            icon: "no-merchant",
                            text: "No Merchant(s) Found",
                            subText: "You haven't boarded any merchant yet",
                        });
                    }
                }
            })
            .catch((err: HttpErrorResponse) => console.log);
    }

    searchmerchant(obj) {
        let a = {
            search: "merchantSearch",
        };
        if (obj.hasOwnProperty("Status")) {
            if (obj.Status === "All") {
                obj.Status = null;
            }
        }
        obj = { ...a, ...obj };
        this.AdvSearch = obj;
        this.getMerchants(obj);
    }
}
