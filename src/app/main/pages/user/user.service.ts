import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '@fuse/services/base.service';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class UserService extends BaseService {
    private panel = new BehaviorSubject<any>(null);
    public panelChange = this.panel.asObservable();
    constructor(_http: HttpClient) {
        super(_http);
       }

       userList(obj: any): any{
        const url = `${environment.apiURL}User/Search`;
         return this.post(url, obj);
        }
        updateUser(obj: any):any {
            const url = `${environment.apiURL}User`;
            return this.post(url,obj);
          }
        updatePassword(obj: any): any {
            const url = `${environment.apiURL}Login/ChangePassword`;
            return this.post(url,obj);
        }
        saveUser(obj: any){
            const url = `${environment.apiURL}User`;
            return this.post(url, obj);   
       }
       updateTable(status): any {
        return this.panel.next(status);
      }    
}