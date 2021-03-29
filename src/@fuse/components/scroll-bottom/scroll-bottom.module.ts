import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollBottomComponent } from './scroll-bottom.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';



@NgModule({
  declarations: [
      ScrollBottomComponent
  ], 
  entryComponents: [ScrollBottomComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  exports     : [
    ScrollBottomComponent
  ],
})
export class ScrollBottomModule { }
