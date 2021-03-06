import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BaseService } from '@fuse/services/base.service';

@Injectable({providedIn: 'root'})
export class SettingService extends BaseService {
    constructor(_http: HttpClient) {
        super(_http);
       }

    getSaleSetingByLocationId(LocationId: number): any{
    const url = `${environment.apiURL}Setting/GetRequiredFields/${LocationId}`;
    return this.get(url);
    }
    basicInfo(obj: any): any{
    const url = `${environment.apiURL}Setting/Search`;
    return this.post(url, obj);   
    }
    saveBasicInfo(obj: any): any{
        const url = `${environment.apiURL}Setting/CreateUserSetting`;
        return this.post(url, obj);   
        }
    
    saveSaleSettingByLocation(data: any[]){
    const url = `${environment.apiURL}Setting/CreateRequiredFields`;
    return this.post(url, data);   
    }
    sendEmail(data) {
        const url = `${environment.apiURL}setting/sendEmail`
        return this.post(url, data);
     } 
     sendReceipt(data) {
        const url = `${environment.apiURL}Transaction/SendReceipt`
        return this.post(url, data);
     } 
    resendCredentials(obj: any): any{
        const url = `${environment.apiURL}Setting/resendemail`;
        return this.post(url, obj);
    }
    plgManager(obj: any):any {
        const url = `${environment.apiURL}Setting/CreatePLG`;
        return this.post(url, obj);
    }
    getPlgManager(obj: any):any {
        const url = `${environment.apiURL}Setting/GetPLG`;
        return this.post(url, obj);
    }
    getAuthKey(obj: any):any{
        const url = `${environment.apiURL}User/GetAuthKey`;
        return this.post(url, obj);
    }



}