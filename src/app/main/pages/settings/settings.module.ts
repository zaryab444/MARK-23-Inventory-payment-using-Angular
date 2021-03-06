import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRoutingModule } from './settings-routing.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SettingsComponent } from './settings.component';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { BasicInfoComponent } from './tabs/basic-info/basic-info.component';
import { GeneralSettingComponent } from './tabs/general-setting/general-setting.component';
import { MakeSaleSettingComponent } from './tabs/general-setting/general-tabs/make-sale-setting/make-sale-setting.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ApiKeyComponent } from './tabs/api-key/api-key.component';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { FuseMaterialColorPickerModule } from '@fuse/components/material-color-picker/material-color-picker.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxMaskModule } from 'ngx-mask';
import { FlexLayoutModule } from '@angular/flex-layout';
import {ClipboardModule} from '@angular/cdk/clipboard';
import { SelectSearchDropdownModule } from '@fuse/components/select-search-dropdown/select-search-dropdown.module';

@NgModule({
  declarations: [SettingsComponent,
     BasicInfoComponent, GeneralSettingComponent, 
     MakeSaleSettingComponent, ApiKeyComponent,
    ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
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
    NgxMaskModule.forRoot(),
    FlexLayoutModule,
    ClipboardModule,
    SelectSearchDropdownModule

  ]
})
export class SettingsModule { }
