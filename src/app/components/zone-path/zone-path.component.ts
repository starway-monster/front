import { ZoneEventsHandlerService } from './../../shared/services/zone-events-handler.service';
import { IBestPathsDetails, IDetailedPathInformation } from './../../api/models/zone.model';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';

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

  pathTypes = PathType;

  selectedPathType: PathType = PathType.byTransfersCount;

  selectedPath: IDetailedPathInformation;

  graphPath: string[];

  initialState = true;

  hoveredItems$ = this.zoneEventsHandlerService.hoveredZones$;

  constructor(
    private readonly zoneEventsHandlerService: ZoneEventsHandlerService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.bestPathsDetails) {
      this.onSelectedPathTypeChanged(PathType.byTransfersCount)
      this.initialState = false;
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
  }
}
