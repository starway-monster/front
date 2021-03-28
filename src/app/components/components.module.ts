import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { ZonePathComponent } from './zone-path/zone-path.component';
import { SharedModule } from '../shared/shared.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { DependencyGraphCardComponent } from './dependency-graph-card/dependency-graph-card.component';
import { SearchGraphPathCardComponent } from './search-graph-path-card/search-graph-path-card.component';
import { TransferDialogComponent } from './transfer-dialog/transfer-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { TransferResultDialogComponent } from './transfer-result-dialog/transfer-result-dialog.component';

@NgModule({
  declarations: [NavbarComponent, FooterComponent, ZonePathComponent, DependencyGraphCardComponent, SearchGraphPathCardComponent, TransferDialogComponent, TransferResultDialogComponent],
  exports: [NavbarComponent, FooterComponent, ZonePathComponent, DependencyGraphCardComponent, SearchGraphPathCardComponent, TransferDialogComponent],
  imports: [
    CommonModule,
    SharedModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    RouterModule
  ]
})
export class ComponentsModule { }
