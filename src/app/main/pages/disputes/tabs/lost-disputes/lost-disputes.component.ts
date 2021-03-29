import { Component,  Input, OnInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DisputesService } from '../../disputes.service';

@Component({
  selector: 'app-lost-disputes',
  templateUrl: './lost-disputes.component.html',
  styleUrls: ['./lost-disputes.component.scss']
})
export class LostDisputesTableComponent implements OnInit {
  public dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @Input() data: any;
  public displayedColumns: string[] = ['Dispute.amount','Info.MerchantUserName','Info.CardType','Dispute.reason','Dispute.created','Dispute.status'];
  /**
     * Constructor
     * @param {UserConfigService} _userConfigService
     * @param {FormBuilder} _formBuilder
  */
  constructor(
    private readonly _DisputesService : DisputesService,
  ) {   }

  ngOnInit(): void {
    if(this.data){
      this.dataSource.data = this.data.data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (data, sortHeaderId: string) => {
        return this.getPropertyByPath(data, sortHeaderId);
      };
    }
  }
  getPropertyByPath(obj: Object, pathString: string) {
    return pathString.split(".").reduce((o, i) => o[i], obj);
  }
  
  }

