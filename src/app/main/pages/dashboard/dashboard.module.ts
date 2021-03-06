import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { NoFoundModule } from '@fuse/components/no-found/no-found.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { TransactionModule } from '../transaction/transaction.module';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { MatButtonModule } from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { NgxShimmerLoadingModule } from  'ngx-shimmer-loading';
import { ShimmerLoaderModule } from '@fuse/components/shimmer-loader/shimmer-loader.module';


@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FuseSharedModule,
    ChartsModule,
    NgxChartsModule,
    TransactionModule,
    MatButtonModule,
    NoFoundModule,
    MatProgressSpinnerModule,
    NgxShimmerLoadingModule,
    ShimmerLoaderModule
  ]
})
export class DashboardModule { }
