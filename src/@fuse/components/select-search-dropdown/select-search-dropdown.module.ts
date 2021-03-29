import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { SelectSearchDropdownComponent } from './select-search-dropdown.component';
import { MatInputModule } from '@angular/material/input';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';


@NgModule({
  declarations: [SelectSearchDropdownComponent],
  entryComponents:[SelectSearchDropdownComponent],
  imports: [
    CommonModule,
    NgxMatSelectSearchModule,
    FuseSharedModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
  exports : [
    SelectSearchDropdownComponent
  ]
})
export class SelectSearchDropdownModule { }
