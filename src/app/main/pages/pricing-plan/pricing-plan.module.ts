import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PricingPlanRoutingModule } from './pricing-plan-routing.module';
import { PricingPlanListComponent } from './pricing-plan-list/pricing-plan-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { PricingPlanCreateComponent } from './pricing-plan-create/pricing-plan-create.component';
import { PricingPlanEditComponent } from './pricing-plan-edit/pricing-plan-edit.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PricingPlanFormComponent } from './pricing-plan-form/pricing-plan-form.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { AssigneeDialogModule } from '@fuse/components';
import { PricingPlanTableComponent } from './pricing-plan-table/pricing-plan-table.component';
import { NoFoundModule } from '@fuse/components/no-found/no-found.module';
import {MatTooltipModule} from '@angular/material/tooltip';
import { NgxCurrencyModule } from "ngx-currency";
import {NgxMaskModule} from 'ngx-mask';
import { AdvancedSearchModule } from '@fuse/components/advanced-search/advanced-search.module';
import { ScrollBottomModule } from '@fuse/components/scroll-bottom/scroll-bottom.module';



@NgModule({
  declarations: [
    PricingPlanListComponent, 
    PricingPlanCreateComponent, 
    PricingPlanEditComponent, 
    PricingPlanFormComponent, 
    PricingPlanTableComponent,
  ],
  entryComponents: [
    PricingPlanTableComponent,
    PricingPlanCreateComponent,
    PricingPlanEditComponent
  ],
  exports: [
    PricingPlanListComponent, 
  ],
  imports: [
    CommonModule,
    PricingPlanRoutingModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    FuseSharedModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatSelectModule,
    MatFormFieldModule,
    AssigneeDialogModule,
    MatDialogModule,
    NoFoundModule,
    MatTooltipModule,
    NgxCurrencyModule,
    NgxMaskModule.forRoot(),
    AdvancedSearchModule,
    ScrollBottomModule
    
  ]
})
export class PricingPlanModule { }
