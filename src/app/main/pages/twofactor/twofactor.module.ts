import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwofactorRoutingModule } from './twofactor-routing.module';
import { TwostepComponent } from './twostep/twostep.component';
import { MatDividerModule } from '@angular/material/divider';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatRadioModule} from '@angular/material/radio';
import { NgOtpInputModule } from  'ng-otp-input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
  declarations: [TwostepComponent],
  imports: [
    CommonModule,
    TwofactorRoutingModule,
    CommonModule,
    MatButtonModule,
    MatToolbarModule,
    FuseSharedModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FlexLayoutModule,
    MatTooltipModule,
    MatDividerModule,
    MatRadioModule,
    NgOtpInputModule,
    MatProgressSpinnerModule
   
  ]
})
export class TwofactorModule { }
