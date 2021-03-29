import { HttpErrorResponse } from '@angular/common/http';
import { Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { NoFoundComponent } from '@fuse/components/no-found/no-found.component';
import { UserConfigService } from '@fuse/services/user.config.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LastActivityService } from '../last-activity.service';
import { ListActivityComponent } from '../list-activity/list-activity.component';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ActivityComponent implements OnInit {
@ViewChild('renderingContainer', {read: ViewContainerRef}) container: ViewContainerRef;
private componentRef: ComponentRef<any>;
private _unsubscribeAll: Subject<any>;
public ActivityLogs : any;
public pageNr: any = 1;
public dontRendered: boolean = false

 /**
    * Constructor
    * @param { ComponentFactoryResolver} _resolver
    * @param {LastActivityService} _activityService
    * @param {UserConfigService} _userConfigService
    */
   
  constructor( 
    private _activityService : LastActivityService,
    private _userConfigService : UserConfigService,
    private _resolver: ComponentFactoryResolver,
  ) {
      this._unsubscribeAll = new Subject();
     
   }

  ngOnDestroy(): void {
  //  Unsubscribe From all subcribe
  this._unsubscribeAll.next();
  this._unsubscribeAll.complete();
  this.componentRef && this.componentRef.destroy();
  }
   
  ngOnInit(): void {
    this._userConfigService.userModeChange
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(() => this.getActivity());
  }


  renderingComponent(type,  data?){
    const foctory: ComponentFactory<any> = this._resolver.resolveComponentFactory(type);
    if(this.dontRendered) {
      this.componentRef.instance.data = data;
    } else {
      this.container.clear();
      this.componentRef = this.container.createComponent(foctory);
      this.componentRef.instance.data = data;
    }
    this.componentRef.instance.fetchMore.subscribe((res:any)=> {
    if(res) {
      this.dontRendered = res;
      this.paginatePage();
      this.getActivity()
    }
    })
  }
  paginatePage(): void {
    this.pageNr ++;
  }

  getActivity(val?){
    let obj : any = {};
    let pageObj: any = {
      RecordLimit: 20,
      PageNo:this.pageNr,
    }
    obj = this._userConfigService.getUserMode();
   if(obj && obj.hasOwnProperty('PartnerId')){
      obj = {
        UserRoleId:3,
        EntityId: obj.PartnerId,
      
      }
    }
    if(obj && obj.hasOwnProperty('ResellerId')){
      obj = {
        UserRoleId:4,
        EntityId : obj.ResellerId,
       
      }
    }
    if(obj && obj.hasOwnProperty('MerchantId')){
      obj = {
        UserRoleId:2,
        EntityId : obj.MerchantId,
       
      }
    }
    obj = { ...obj, ...pageObj }
      this._activityService.activityLog(obj)
      .then((res: any) => {
        if(res && !res.StatusCode){
          if(res.Response && res.Response.ActivityLogs.length){
            this.ActivityLogs = res.Response.ActivityLogs;
            this._activityService.setAcitivity(this.ActivityLogs);
            this.renderingComponent(ListActivityComponent, {ActivityLogs: this.ActivityLogs});
          }
          else{
            this.renderingComponent(NoFoundComponent,{
              icon: 'LastActivity',
              text: "No Activity's Found",
              subText: "you haven't made any activity yet"
            });
          }
      
        }
      }).catch((err:HttpErrorResponse) => (console.log))
  }

 

}
