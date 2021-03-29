import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { snackBarConfig, snackBarConfigWarn, validateAllFormFields, validator ,truncateTextLength,dateFormat} from '../../../../../constants/globalFunctions';
import { UserService } from '../user.service';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { UserConfigService } from '@fuse/services/user.config.service';

import { SlidingPanelService } from '@fuse/components/sliding-panel/sliding-panel.service';
import { AuthenticationService } from 'app/main/authentication/authentication.service';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss'],
  animations   : fuseAnimations

})
export class UserTableComponent implements OnInit {
  public validator = validator;
  public truncateTextLength = truncateTextLength;
  public dateFormat = dateFormat;
  @ViewChild('userDialog') userDialog: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @Output() CallExport = new EventEmitter<any>();
  public actionControlOnHover = -1;
  public dataSource = new MatTableDataSource<any>();
  public dialogRef: any;
  @Input() data: any;
  public userForm: FormGroup;
  public userObj: any ={};
  public currentUser;

  public displayedColumns: string[] = ['FirstName', 'LastName', 'Username', 'Phone','IsActive', 'LastLogin'];
    /**
   * Constructor
   *@param {SlidingPanelService} _slidingPanelService
   */

  constructor(
    private readonly _dialog: MatDialog,
    private readonly _userService : UserService,
    private readonly _formBuilder: FormBuilder,
    private readonly _snackBar: MatSnackBar,
    public router: Router,
    private _userConfigService:UserConfigService,

    private readonly _slidingPanelService: SlidingPanelService,
    private readonly _AuthenticationService : AuthenticationService
  ) { }

  ngOnInit(): void {
    this.currentUser =  this._userConfigService.loggedInUser;
    if(this.data.showRole){

        this.displayedColumns.splice(4, 0, 'Role');
    }

    if (this.data) {
    
      this.dataSource.data = this.data.users;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }
 
  createUserForm(): void {
    this.userForm = this._formBuilder.group({
      FirstName: ['',[ Validators.required, Validators.maxLength(validator.maxName)]],
      LastName: ['',[ Validators.required, Validators.maxLength(validator.maxName)]],
      Username: [{value:'', disabled: true}, Validators.required],
      Email: ['', [Validators.required, Validators.email, Validators.pattern(validator.emailPattern)]],
      Phone: ['', Validators.required],
      IsActive: ['']
    });
  }


  openDialog(id): void { 
    const dialogRef = this._dialog.open(FuseConfirmDialogComponent, {width: '550px'});
    dialogRef.componentInstance.data={
      title: "Reset Password Email",
      message:"Are you sure you want to resend reset password email?"
    }
    dialogRef.afterClosed().subscribe((result)=>{
      if (result){
        this.resetPasswordLink(id);
      }
    })
  }

  resetPasswordLink(obj){
    this._AuthenticationService.resetPassword({Email : obj.Username}).then((res:any) => {
        if(res && !res.StatusCode){
         this._snackBar.open('Reset password email has been sent successfully', '', snackBarConfig);
       } 
    }).catch((err: HttpErrorResponse)=>(console.log));
  }

  editUser(value) {
    this._slidingPanelService.getSidebar('slidePanel', 'UserEditComponent', value).toggleOpen();
   }

   exportFile(value){
    let obj = {ExportType: value,'IsExport': true};
    this.CallExport.emit(obj);
  }

}
