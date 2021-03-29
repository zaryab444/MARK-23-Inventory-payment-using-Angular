import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxShimmerLoadingModule } from  'ngx-shimmer-loading';
import { ShimmerLoaderComponent } from './shimmer-loader.component';



@NgModule({
  declarations: [ShimmerLoaderComponent],
  entryComponents : [ShimmerLoaderComponent],
  imports: [
    CommonModule,
    NgxShimmerLoadingModule
  ],
  exports:[ShimmerLoaderComponent]
})
export class ShimmerLoaderModule { }
