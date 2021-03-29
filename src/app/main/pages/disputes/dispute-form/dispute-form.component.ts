import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SlidingPanelService } from '@fuse/components/sliding-panel/sliding-panel.service';
import { snackBarConfigWarn } from 'constants/globalFunctions';

@Component({
  selector: 'app-dispute-form',
  templateUrl: './dispute-form.component.html',
  styleUrls: ['./dispute-form.component.scss']
})
export class DisputeFormComponent implements OnInit {
    public userForm: FormGroup;
    seasons: string[] = ['Physical product', 
    'Digital product or service', 'Offline service', 'Other'];
    public rules : any = [{name :
'Customer communication'},
{name :'Customer signature'},
{name :'Shipping documentation'},
{name :'Other Evidence'},
{name :'Receipt'}
    ]

    files: File[] = [];

  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _snackBar: MatSnackBar,
    private _slidingPanelService:SlidingPanelService

  ) { }

  ngOnInit(): void {
      this.createUserForm();
  }

  createUserForm(): void{
 
    this.userForm = this._formBuilder.group({
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required]
  });
  
  }

onSelect(event) {
  console.log(event);
  this.files.push(...event.addedFiles);
}

onRemove(event) {
  console.log(event);
  this.files.splice(this.files.indexOf(event), 1);
}

closeSlidingPanel(): void {
    this._slidingPanelService.closeSlidingPanel('slidePanel').toggleOpen();
  }

}
