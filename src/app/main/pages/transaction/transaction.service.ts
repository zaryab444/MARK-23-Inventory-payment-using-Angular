import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '@fuse/services/base.service';
import { environment } from 'environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService extends BaseService {

  private panel = new BehaviorSubject<any>(null);
    public panelChange = this.panel.asObservable();
  constructor(_http: HttpClient) {
    super(_http);
  }
  transactionList(obj: any): any {
    const url = `${environment.apiURL}/Transaction/Search`;
    return this.post(url, obj);
  }
  getTransactionDetail(id: string) {
    const url = `${environment.apiURL}Transaction/GetTransactionById/${id}`;
    return this.get(url);
  } 
  refundTransaction(data):any {
    const url = `${environment.apiURL}Transaction/Refund`;
    return this.post(url, data);
}

voidTransaction(data){
    const url = `${environment.apiURL}Transaction/Void`;
    return this.post(url, data);
}

refundACHTransaction(data):any {
    const url = `${environment.apiURL}Transaction/RefundACH`;
    return this.post(url, data);
}

voidACHTransaction(data){
    const url = `${environment.apiURL}Transaction/RefundVoid`;
    return this.post(url, data);
}


updateindexing(status): any {
  return this.panel.next(status);
}
}
