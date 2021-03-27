import { ColorsMappingService } from './../../shared/services/colors-mapping.service';
import { IBestPathsDetails } from './../../api/models/zone.model';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import * as d3 from 'd3';
import { of, ReplaySubject, Subscription } from 'rxjs';
import { catchError, finalize, takeLast, takeUntil } from 'rxjs/operators';
import { IDependenciesResult, IZonesResult } from 'src/app/api/models/zone.model';
import { ZoneService } from 'src/app/api/services/zone.service';
import { ChordsData } from 'src/app/shared/components/dependency-wheel-chart/dependency-wheel-chart.component';

@Component({
  selector: 'sm-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  allZones = [];
  zoneDependencies: ChordsData[] = [];
  querySubstription: Subscription;


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

    this.zonesService.getAllDependencies()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((result: ApolloQueryResult<IDependenciesResult>) => {
        this.zoneDependencies = result?.data?.edge
          ?.map(edge => ({ source: edge.zone1, target: edge.zone2, value: 1 } as ChordsData))
        this.changeDetectorRef.detectChanges();
      });
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}

