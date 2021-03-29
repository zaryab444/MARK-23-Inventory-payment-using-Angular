import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-shimmer-loader',
  templateUrl: './shimmer-loader.component.html',
  styleUrls: ['./shimmer-loader.component.scss']
})
export class ShimmerLoaderComponent implements OnInit {
    @Input() noOfTimes :any;
    @Input() shape :any;
    @Input() height :any;
    @Input() width :any;
    @Input() direction :any;
    public loopCount: any;

  constructor() { 
  

  }

  ngOnChanges(): void {
    this.loopCount = Array.from({length:this.noOfTimes},(v,k)=>k+1);
      
  }
  ngOnInit(): void {
  }

}
