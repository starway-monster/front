import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface HoveredConnection {
  zone1: string;
  zone2: string;
}

@Injectable({
  providedIn: 'root'
})
export class ZoneEventsHandlerService {

  private hoveredZonesSubj = new BehaviorSubject<string[]>([]);
  private hoveredConnectionsSubj = new BehaviorSubject<HoveredConnection[]>([]);

  public hoveredZones$ = this.hoveredZonesSubj.asObservable();
  public hoveredConnections$ = this.hoveredConnectionsSubj.asObservable();

  setHoveredZones(... value: string[]) {
    this.hoveredZonesSubj.next(value);
  }

  setHoveredConnections(... value: HoveredConnection[]) {
    this.hoveredConnectionsSubj.next(value);
  }
}
