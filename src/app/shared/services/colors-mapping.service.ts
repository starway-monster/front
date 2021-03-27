import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorsMappingService {

  private zoneColorsMap: Map<string, string>;

  private colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf", "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf", "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf", "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];

  public setZoneNames(names: string[]) {
    this.zoneColorsMap = this.createZoneMap(names);
  }

  public getColorByZone(name: string): string {
    return this.zoneColorsMap && this.zoneColorsMap.get(name) || this.colors[0];
  }

  private createZoneMap(names: string[]) {
    const colorsMap = new Map<string, string>();
    for (let i = 0; i < names.length; i++) {
      colorsMap.set(names[i], this.colors[i]);
    }
    return colorsMap;
  }
}
