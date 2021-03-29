import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-fraud-dashboard-list',
  templateUrl: './fraud-dashboard-list.component.html',
  styleUrls: ['./fraud-dashboard-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FraudDashboardListComponent implements OnInit {
  @ViewChild('picker') datePicker: MatDatepicker<any>;
  @ViewChild('datepickerFooter', {static: false}) datepickerFooter: ElementRef;
    
  public ranges: Array<{key: string, label: string}> = [
    {key: 'today', label: 'Today'},
    {key: 'yesterday', label: 'Yesterday'},
    {key: 'thisweek', label: 'This Week'},
    {key: 'lastweek', label: 'Last Week'},
    {key: 'thismonth', label: 'This Month'},
    {key: 'lastmonth', label: 'Last Month'},
    {key: 'last60', label: 'Last 60 Days'},
    {key: 'last90', label: 'Last 90 Days'},
    {key: 'thisyear', label: 'This Year'},
];
  constructor() { }

  ngOnInit(): void {
  }
  onOpen() {
    const matCalendar = 
    document.getElementsByClassName('mat-calendar-content')[0] as HTMLElement;
    matCalendar.appendChild(this.datepickerFooter.nativeElement);
}

}
