import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ITransferDetailsData {
  fromZone: string;
  toZone: string;
  sourcePort: string;
  sourceChannel?: string;
  denom?: string;
  sender: string;
  receiver: string;
  amount: number;
  channels: string[];
}

@Component({
  selector: 'sm-transfer-dialog',
  templateUrl: './transfer-dialog.component.html',
  styleUrls: ['./transfer-dialog.component.scss']
})
export class TransferDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<TransferDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ITransferDetailsData) { }

  ngOnInit(): void {
  }

}
