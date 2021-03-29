import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisputesComponent } from './disputes.component';
import { DisputesRoutingModule } from './disputes-routing.module';
import { MatTabsModule } from '@angular/material/tabs';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import { NgxCurrencyModule } from 'ngx-currency';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatChipsModule} from '@angular/material/chips';

import { WonDisputesTableComponent } from './tabs/won-disputes/won-disputes.component';
import { LostDisputesTableComponent } from './tabs/lost-disputes/lost-disputes.component';
import { AllDisputesTableComponent } from './tabs/all-disputes/all-disputes.component';
import { AllDisputesComponent } from './disputes-list/disputes-list.component';
import { MatSortModule } from '@angular/material/sort';
import { DisputeDetailsComponent } from './dispute-details/dispute-details.component';
import { DisputeFormComponent } from './dispute-form/dispute-form.component';
import { MatDividerModule } from '@angular/material/divider';
import { HorizontalTimelineComponent } from '@fuse/components/horizontal-timeline/horizontal-timeline.component';
import {MatRadioModule} from '@angular/material/radio';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ScrollBottomModule } from '@fuse/components/scroll-bottom/scroll-bottom.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';



@NgModule({
  entryComponents:[  
    AllDisputesComponent,
     AllDisputesTableComponent,
     LostDisputesTableComponent,
     WonDisputesTableComponent
  ],
  declarations: [
    DisputesComponent,    
    AllDisputesComponent,
     AllDisputesTableComponent,
     LostDisputesTableComponent,
     WonDisputesTableComponent,
     DisputeDetailsComponent,
     DisputeFormComponent,
     HorizontalTimelineComponent
  ],
  imports: [
    CommonModule,
    DisputesRoutingModule,
    MatTabsModule,
    FuseSharedModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatButtonModule,
    NgxCurrencyModule,
    MatIconModule,
    MatDialogModule,
    MatToolbarModule,
    MatTooltipModule,
    MatChipsModule,
    MatDividerModule,
    MatRadioModule,
    NgxDropzoneModule,
    ScrollBottomModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class DisputesModule { }
