import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FuseSharedModule } from '@fuse/shared.module';
import { ToolbarComponent } from 'app/layout/components/toolbar/toolbar.component';
import { HierarchicalTreeModule } from '@fuse/components/hierarchical-tree/hierarchical-tree.module';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
    declarations: [
        ToolbarComponent
    ],
    imports     : [
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatToolbarModule,
        HierarchicalTreeModule,
        FuseSharedModule,
        MatTooltipModule
    ],
    exports     : [
        ToolbarComponent
    ]
})
export class ToolbarModule
{
}
