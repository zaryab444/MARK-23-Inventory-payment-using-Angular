import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { SlidingPanelService } from '@fuse/components/sliding-panel/sliding-panel.service';

@Component({
  selector: 'app-dispute-details',
  templateUrl: './dispute-details.component.html',
  styleUrls: ['./dispute-details.component.scss']
})
export class DisputeDetailsComponent implements OnInit {
  items : any = [
    { caption: '16 Jan', date: new Date(2021, 1, 16), selected: true, title: 'Horizontal Timeline', content: "Case Started" },
    { caption: '28 Feb', date: new Date(2021, 2, 28), title: 'Event title here', content: "Case Review" },
    { caption: '20 Mar', date: new Date(2021, 3, 20), title: 'Event title here', content: "Verifing Details" },
    { caption: '20 May', date: new Date(2021, 5, 20), title: 'Event title here', content: "Documents Submitted" },
    { caption: '09 Jul', date: new Date(2021, 7, 9), title: 'Event title here', content: "Case Closed" },
    ];



  constructor(
    private readonly _dialog: MatDialog,
    private readonly _slidingPanelService: SlidingPanelService,

  ) { }

  ngOnInit(): void {

  }


  confirmDisputeDialog(): void { 
    const dialogRef = this._dialog.open(FuseConfirmDialogComponent, {width: '550px'});
    dialogRef.componentInstance.data={
      title: "Accept dispute",
      message:"Are you sure you want to accept this dispute? You will automatically lose this dispute and will no longer be able to submit evidence that the payment is legitmate."
    }
    dialogRef.afterClosed().subscribe((result)=>{
      if (result){
        this.acceptDispute();

      }
    })
  
  }


  openSlidePanel(): void {
    this._slidingPanelService.getSidebar('slidePanel', 'DisputeFormComponent').toggleOpen();
  }

  acceptDispute(){
    console.log("disputed")
  }

}
