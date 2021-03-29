import { Component, HostListener, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-scroll-bottom',
  templateUrl: './scroll-bottom.component.html',
  styleUrls: ['./scroll-bottom.component.scss'],
  animations:fuseAnimations
})
export class ScrollBottomComponent implements OnInit {
    public showBtn : boolean = false;
  constructor() { }

  ngOnInit(): void {
    // var currentwindow = document.getElementById("container-3");
    window.addEventListener("scroll", this.scroll, true);
}
  ngOnDestroy() {
    window.removeEventListener('scroll', this.scroll, true);
    }
 scroll = (event): void => {

    this.detectBottom();
    //handle your scroll here
    //notice the 'odd' function assignment to a class field
    //this is used to be able to remove the event listener
};
detectBottom(): void {
    var id = document.getElementById("content");
    var id2 = document.getElementById("container-3");

   
    if (id2.offsetHeight + id.parentElement.scrollTop >= id.offsetHeight) {
       
        // if (!this.loadedAll) {
        //     this.fetchMore.emit(true);
        // }
    }
    if(id.parentElement.scrollTop >= 300){
        this.showBtn = true;
    }else{
        this.showBtn = false;
    }
    
  }


  
  ScrollToTop(){
      let top = document.getElementById('container-3')
   
     // top.scrollTo(0, 0);


      top.scroll({ 
        top: 0, 
        left: 0, 
        behavior: 'smooth' 
      });
     // top.scrollIntoView({ behavior: 'smooth', block: 'start', inline: "nearest" })
  }
}
