import { ApolloQueryResult } from '@apollo/client/core';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { of, ReplaySubject } from 'rxjs';
import { catchError, takeLast, takeUntil } from 'rxjs/operators';
import { IDetailedPathInformation, IZonesResult } from 'src/app/api/models/zone.model';
import { ZoneService } from 'src/app/api/services/zone.service';
import { ColorsMappingService } from 'src/app/shared/services/colors-mapping.service';

@Component({
  selector: 'sm-unescrow-token',
  templateUrl: './unescrow-token.component.html',
  styleUrls: ['./unescrow-token.component.scss']
})
export class UnescrowTokenComponent implements OnInit {

  allZones = [];
  initialState = true;
  selectedCurrentZone: string;
  trace: string;
  zonesUnescrowPath: IDetailedPathInformation;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private readonly zonesService: ZoneService,
    private readonly colorsMappingService: ColorsMappingService,
    private readonly changeDetectorRef: ChangeDetectorRef) {  }

  ngOnInit() {
    this.zonesService.getAllZones()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((result: ApolloQueryResult<IZonesResult>) => {
        const zoneNames = result?.data?.zones.map(z => z.name) ?? [];
        this.colorsMappingService.setZoneNames(zoneNames);
        this.allZones = zoneNames;
        this.changeDetectorRef.detectChanges();
      });
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  onSearch() {
    this.zonesService.getUnescrowPath(this.selectedCurrentZone, this.trace)
      .pipe(
        takeLast(1),
        catchError(_ => of(undefined))
      ).subscribe(result => {
        this.zonesUnescrowPath = result;
        this.changeDetectorRef.detectChanges();
      });
  }
}
