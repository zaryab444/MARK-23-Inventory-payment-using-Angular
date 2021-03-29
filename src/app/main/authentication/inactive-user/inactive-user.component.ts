import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-inactive-user',
  templateUrl: './inactive-user.component.html',
  styleUrls: ['./inactive-user.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class InactiveUserComponent implements OnInit {
  public showContent : boolean = false;
  constructor() { }

  ngOnInit() {
      
  }

  onImageLoad(){
      this.showContent = true;
  }
}
