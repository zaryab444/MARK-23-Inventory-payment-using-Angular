import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '@fuse/services/base.service';
import { environment } from 'environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DisputesService extends BaseService{
    private panel = new BehaviorSubject<any>(null);
    public panelChange = this.panel.asObservable();
  [x: string]: any;

  constructor(_http: HttpClient) {
    super(_http);
   }
  disputeList(obj: any){
    const url = `${environment.apiURL}Transaction/GetDisputedTransaction`;
    return this.post(url, obj);
  }
  disputeReverse(obj: any){
    const url = `${environment.apiURL}Transaction/TransferReversal`;
    return this.post(url, obj);
  }
  updatetable(status): any {
    return this.panel.next(status);
  }
}
