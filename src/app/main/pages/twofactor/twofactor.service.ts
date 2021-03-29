import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BaseService } from '@fuse/services/base.service';

@Injectable({providedIn: 'root'})
export class TwofactorService extends BaseService {
    constructor(_http: HttpClient) {
        super(_http);
       }

    getGenerateQRCode(obj: any):any{
        const url = `${environment.apiURL}Login/GenerateQRCode`;
        return this.post(url, obj);
    }
    Authenticate(obj: any):any{
        const url = `${environment.apiURL}Login/GoogleAuthenticate`;
        return this.post(url, obj);
    }

}