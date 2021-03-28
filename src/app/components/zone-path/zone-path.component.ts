import { WalletInteractionService } from './../../shared/services/wallet-interaction.service';
import { ItransferRequest } from './../../shared/components/horizontal-snake-graph/horizontal-snake-graph.component';
import { HoveredConnection, ZoneEventsHandlerService } from './../../shared/services/zone-events-handler.service';
import { IBestPathsDetails, IDetailedPathInformation } from './../../api/models/zone.model';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { TransferDialogComponent } from '../transfer-dialog/transfer-dialog.component';
import { MatDialog } from '@angular/material/dialog';

export enum PathType {
  byFee = 'byFee',
  byTransfersCount = 'byTransfersCount'
}

@Component({
  selector: 'sm-zone-path',
  templateUrl: './zone-path.component.html',
  styleUrls: ['./zone-path.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZonePathComponent implements OnChanges {

  @Input()
  bestPathsDetails: IBestPathsDetails & IDetailedPathInformation;

  @Input()
  multiplePath = true;

  @Input()
  initialState: boolean;

  pathTypes = PathType;

  selectedPathType: PathType = PathType.byTransfersCount;

  selectedPath: IDetailedPathInformation;

  graphPath: string[];


  hoveredItems$ = this.zoneEventsHandlerService.hoveredZones$;

  constructor(
    private readonly zoneEventsHandlerService: ZoneEventsHandlerService,
    private readonly walletInteractionService: WalletInteractionService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.bestPathsDetails) {
      this.onSelectedPathTypeChanged(PathType.byTransfersCount)
    }
  }

  onSelectedPathTypeChanged(type: PathType) {
    this.selectedPathType = type;
    if (this.bestPathsDetails) {
      this.selectedPath = !this.multiplePath
        ? this.bestPathsDetails
        : type === PathType.byFee
          ? this.bestPathsDetails.pathByFee
          : this.bestPathsDetails.pathByTransfers;
      this.graphPath = this.selectedPath.graph.reduce((prev, curr, index) => {
        if (index === 0) {
          prev.push(curr.fromZone);
        }
        prev.push(curr.toZone);
        return prev;
      }, []);
    }
    this.changeDetectorRef.detectChanges();
  }

  hoveredItemChanged(itemName: string[]) {
    this.zoneEventsHandlerService.setHoveredZones(...itemName);
    if (itemName.length > 1) {
      this.zoneEventsHandlerService.setHoveredConnections({zone1: itemName[0], zone2: itemName[1]});
    } else {
      this.zoneEventsHandlerService.setHoveredConnections(...[]);
    }
  }

  hoverAllPath() {
    this.zoneEventsHandlerService.setHoveredZones(...this.graphPath)
    const hoveredConnections = this.selectedPath.graph.map(pathItem => ({ zone1: pathItem.fromZone, zone2: pathItem.toZone } as HoveredConnection));
    this.zoneEventsHandlerService.setHoveredConnections(...hoveredConnections);
  }

  unhoverAllPath() {
    this.zoneEventsHandlerService.setHoveredZones(...[]);
    this.zoneEventsHandlerService.setHoveredConnections(...[])
  }

  onTransferRequested(request: ItransferRequest) {
    const pathToExecute = this.selectedPath.graph
      .find((item) => item.fromZone === request.zone1 && item.toZone === request.zone2);
    this.walletInteractionService.openDialog(pathToExecute);
  }
}
