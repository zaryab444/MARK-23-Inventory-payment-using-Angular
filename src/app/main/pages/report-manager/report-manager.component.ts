import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-report-manager',
  templateUrl: './report-manager.component.html',
  styleUrls: ['./report-manager.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReportManagerComponent implements OnInit {

    public listCards = [
        // {
        //   "heading":"Transactions",
        //   "bottomheading":"View Transaction History",
        //   "icon":"receipt",
        //   "url":'/pages/report-manager/transcations'
        // },
        {
          "heading":"Transaction Summary",
          "bottomheading":"View Transaction Summary",
          "icon":"description",
          "class":'accent',
          "url":'/pages/report-manager/summary'
        },
        {
          "heading":"Disputes",
          "bottomheading":"View Disputes",
          "icon":"wrap_text",
          "url":'/pages/report-manager/disputes',
          "class":'accent'
        },
        {
          "heading":"Scheduled Reports",
          "bottomheading":"View Reports Setup",
          "icon":"restore",
          "class":'primary'
          // "url":'/pages/report-manager/setup'
        }];

  constructor() { }

  ngOnInit(): void {
  }

}
