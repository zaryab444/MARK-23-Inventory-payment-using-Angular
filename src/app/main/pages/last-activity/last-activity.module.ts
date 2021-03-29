import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LastActivityRoutingModule } from './last-activity-routing.module';
import { ActivityComponent } from './activity/activity.component';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { FusePipesModule } from '@fuse/pipes/pipes.module';
import { ListActivityComponent } from './list-activity/list-activity.component';
import { NoFoundModule } from '@fuse/components/no-found/no-found.module';
import { ScrollBottomModule } from '@fuse/components/scroll-bottom/scroll-bottom.module';

@NgModule({
  declarations: [ ActivityComponent, ListActivityComponent],
  entryComponents:[
    ListActivityComponent
  ],
  imports: [
    CommonModule,
    LastActivityRoutingModule,
    FuseSharedModule,
    MatIconModule,
    FusePipesModule,
    NoFoundModule,
    ScrollBottomModule
  ]
})
export class LastActivityModule { }
