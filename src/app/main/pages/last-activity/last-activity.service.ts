import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '@fuse/services/base.service';
import { environment } from 'environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LastActivityService extends BaseService {
  private activityData = new BehaviorSubject<any>(null);
  public activeChange = this.activityData.asObservable();
  constructor(_http: HttpClient) { 
    super(_http);
  }
  activityLog(obj: any){
    const url = `${environment.apiURL}ActivityLog/Search`;
    return this.post(url, obj);
  }
  getAcitivity() {
    return this.activityData.getValue();
  }
  setAcitivity(data?) {
    const obj = data
    return this.activityData.next(obj);
  }
  
 
}
