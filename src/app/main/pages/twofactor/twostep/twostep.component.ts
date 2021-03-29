import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import {Router} from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Subject } from "rxjs";
import { UserConfigService } from "@fuse/services/user.config.service";
import { TwofactorService } from "../twofactor.service";
import { snackBarConfigWarn } from "constants/globalFunctions";

@Component({
    selector: "app-twostep",
    templateUrl: "./twostep.component.html",
    styleUrls: ["./twostep.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class TwostepComponent implements OnInit {
    private _unsubscribeAll: Subject<any>;
    public verification = false;
    public userName: string;
    public otp = 0;
    public hiddenEmail;
    public showBarCode: boolean = false;
    public generatedCode: any;
    public defaultPage: boolean = true;
    public timeLeft = 30;
    public interval: any;
    public Buttondisabled: boolean = true;
    public usertoken: any;
    /**
     * Constructor
     *@param {UserConfigService} _userConfigService
     * @param {FormBuilder} _formBuilder
     * @param {MatSnackBar} _snackBar
     * @param {TwofactorService} _twofactorservice,
     * @param {Router} _router
     */
    constructor(
        private readonly _snackBar: MatSnackBar,
        private readonly _userConfigService: UserConfigService,
        private readonly _twofactorservice: TwofactorService,
        private readonly _router: Router,
    ) {
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
       
    }

    verified() {
        this.Buttondisabled = false;
        const obj = {
            ...this._userConfigService.getUserMode(),
        };
        this._twofactorservice
            .getGenerateQRCode(obj)
            .then((res: any) => {
                if (res && !res.StatusCode) {
                    if (res.Response) {
                        this.generatedCode = res.Response;
                        this.showBarCode = true;
                        this.newUserPage();
                        
                    } else {
                    }
                }
            })
            .catch((err: HttpErrorResponse) => console.log);
    }
    onOtpChange(otp) {
        this.otp = otp;
        if (otp.length === 6) {
            this.submit();
        }
    }
    submit() {
        const obj = {
            ...this._userConfigService.getUserMode(),
            Code: this.otp,
        };
        this._twofactorservice
            .Authenticate(obj)
            .then((res: any) => {
               
                    if (!res.StatusCode) {
                       this.usertoken = res.Response;
                        this.Redirect();
                    } else {
                        this._snackBar.open(res.StatusMessage, '', snackBarConfigWarn);
                    }
             
            })
            .catch((err: HttpErrorResponse) => console.log);
    }
    Redirect() {
        const obj = {
            token:  this.usertoken,
        };
        window.location.href = 'https://apps.paynomix.com/v1/paynomix/authenticate/?token='+this.usertoken;
   
    }

    newUserPage() {
        this.defaultPage = !this.defaultPage;
    }


    // startTimer() {
    //     this.interval = setInterval(() => {
    //       if(this.timeLeft > 0) {
    //         this.timeLeft--;
    //       } else {
    //         clearInterval(this.interval);
    //         this.timeLeft= 30;
    //         this.showBarCode = false;
    //         this.Buttondisabled = true;
    //       }
    //     },1000)
    //   }
}
