import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '@fuse/services/base.service';
import { environment } from '../../../../environments/environment';

@Injectable({providedIn: 'root'})
export class SaleService extends BaseService {
    constructor(_http: HttpClient) {
        super(_http);
       }

    locationList(obj: any){
    const url = `${environment.apiURL}Location/Search`;
    return this.post(url, obj);
    }

    transactionInit(obj: any){
        const url = `${environment.apiURL}Transaction/InitTransaction`;
        return this.post(url, obj);
    }
    payTransaction(obj):any {
        const url = `${environment.apiURL}Transaction/Update`;
        return this.post(url, obj);
    }
    AchTransaction(obj):any {
        const url = `${environment.apiURL}Transaction/SaleACH`;
        return this.post(url, obj);
    }
    getTransactionById(id : string) { 
        const url = `${environment.apiURL}Transaction/GetTransactionById/${id}`;
        return this.get(url);
    }
    getIPAddress()
    {
        return this.get("http://api.ipify.org/?format=json");
        
    }
    getMerchantDetail(id: string) {
        const url = `${environment.apiURL}Merchant/GetMerchantById/${id}`;
        return this.get(url);
    }
   
}