import { ApolloQueryResult } from '@apollo/client/core';
import { IChannelInfo } from './../../api/models/zone.model';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ZoneService } from 'src/app/api/services/zone.service';

@Component({
  selector: 'sm-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss']
})
export class ChannelsComponent implements OnInit {

  channelsInfo: IChannelInfo[];
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private readonly zonesService: ZoneService,
    private readonly changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.zonesService.getChannelsInfo()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((result: any) => {
        this.channelsInfo = result?.data?.ibc_channels;
        this.changeDetectorRef.detectChanges();
      });
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
