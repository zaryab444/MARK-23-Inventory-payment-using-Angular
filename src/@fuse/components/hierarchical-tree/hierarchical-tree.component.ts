import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import { UserConfigService } from '@fuse/services/user.config.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { truncateTextLength } from '../../../constants/globalFunctions';

interface Node {
  title: string;
  children?: Node[];
}
@Component({
  selector: 'app-hierarchical-tree',
  templateUrl: './hierarchical-tree.component.html',
  styleUrls: ['./hierarchical-tree.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HierarchicalTreeComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit{
@ViewChild('autofocus') public elementRef : ElementRef;
@ViewChild(MatMenuTrigger) triggerMenu: MatMenuTrigger;
public truncateTextLength = truncateTextLength;
@Input() toggleHierarchy: boolean = false;
@Output() menuToggle = new EventEmitter<boolean>()
 public selectedNode: any = {};
 public searchBy = new Subject<string>();
 public searchingText: string;
 public treeControl = new NestedTreeControl<Node>(node => node.children);
 public dataSource = new MatTreeNestedDataSource<Node>();
 private hierarchySubscriber: any;
 private searchSubscriber: any
 public treeData: any;
  text: any;
  constructor(
    private readonly _userConfigService: UserConfigService,

  ) {
  }

  hasChild = (_: number, node: Node) => !!node.children && node.children.length > 0;

  ngOnInit() {
    
   this.hierarchySubscriber = this._userConfigService.getUserHierarchy.subscribe(res=> {
      if(res){
        this.dataSource.data = res;
        this.treeData = res
        this.selectedNode = res[0];
        Object.keys(this.dataSource.data).forEach(x => {
          this.setParent(this.dataSource.data[x], null);
        });
       
      }
    })
  }
  ngAfterViewInit(): void {
     
    this.searchSubscriber = this.searchBy.pipe(
      debounceTime(500),
      distinctUntilChanged())
      .subscribe(value => {
        this.searchingText = value;
        this.setChildOk(value, this.dataSource.data);
      });
  }
  ngOnDestroy(): void{
    // Unsubscribe from all subscriptions
    this.searchSubscriber && this.searchSubscriber.unsubscribe();
    this.hierarchySubscriber && this.hierarchySubscriber.unsubscribe();
  }
  setParent(data, parent) {
    data.parent = parent;
    if (data.children) {
      data.children.forEach(x => {
        this.setParent(x, data);
      });
    }
  }
  ngOnChanges(){
      if(this.toggleHierarchy){
        this.triggerMenu.openMenu();
      }
  }
  menuClosed(){
    this.menuToggle.emit(false);
  }

  menuOpened() 
  {
      this.elementRef.nativeElement.focus();
        this.elementRef.nativeElement.click();
  }

  selectUserMode(node): void{
    this.selectedNode = node;
    this.triggerMenu.closeMenu();
    let obj:any = {};
    if(this.selectedNode.hasOwnProperty('locationid')){
      obj.LocationId = this.selectedNode.locationid;
      // obj.EntityId = this.selectedNode.locationid;
    }else if(this.selectedNode.hasOwnProperty('merchantid')){
      obj.MerchantId = this.selectedNode.merchantid;
      // obj.EntityId = this.selectedNode.merchantid;
      // obj.UserRoleId = 2;
    }
    else if(this.selectedNode.hasOwnProperty('resellerid')){
      obj.ResellerId = this.selectedNode.resellerid;
      // obj.EntityId = this.selectedNode.resellerid;
      // obj.UserRoleId = 4;
    }else{
      if(this.selectedNode.partnerid > 1 ){
        obj.PartnerId = this.selectedNode.partnerid;
        // obj.EntityId = this.selectedNode.partnerid;
        // obj.UserRoleId = 3;
      } else{
        obj = null;
      }
    }
    this._userConfigService.setUserMode(obj);
  }
  setChildOk(text: string, node: any) {
    text = text.toLowerCase();
    node.forEach(x => {
      x.ok = (x.title) ? x.title.toLowerCase().indexOf(text) >= 0: x.title 
      if (x.parent) this.setParentOk(text, x.parent, x.ok);
      if (x.children) this.setChildOk(text, x.children);
    });
  }
  setParentOk(text, node, ok) {
    node.ok = ok || node.ok || node.title.toLowerCase().indexOf(text) >= 0;
    if (node.parent) this.setParentOk(text, node.parent, node.ok);
  }
  onKeypressEvent() {
    this.treeControl.collapseAll();
  }
}
