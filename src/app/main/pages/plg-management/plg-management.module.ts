import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { FuseMaterialColorPickerModule } from '@fuse/components/material-color-picker/material-color-picker.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxMaskModule } from 'ngx-mask';
import { PlgManagementRoutingModule } from './plg-management-routing.module';
import { PlgListComponent } from './plg-list/plg-list.component';
import { PlgTableComponent } from './plg-table/plg-table.component';
import { PlgFormComponent } from './plg-form/plg-form.component';
import { PlgCreateComponent } from './plg-create/plg-create.component';
import { PlgEditComponent } from './plg-edit/plg-edit.component';

@NgModule({
  declarations: [PlgListComponent, PlgFormComponent, PlgTableComponent, PlgCreateComponent, PlgEditComponent],
  entryComponents:[PlgTableComponent],
  imports: [
    CommonModule,
    PlgManagementRoutingModule,
    MatButtonModule,
    FuseSharedModule,
    MatTabsModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    NgxDropzoneModule,
    MatListModule,
    MatCheckboxModule,
    MatRadioModule,
    FuseMaterialColorPickerModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatTooltipModule,
    NgxMaskModule.forRoot()
  ]
})
export class PlgManagementModule { }
