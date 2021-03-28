import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorsMappingService {

  private zoneColorsMap: Map<string, string>;

  private colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#A55D35", "#96B3D3", "#996633", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf",
                    "#990099", "#CC1559", "#FF5EAA", "#d62728", "#9467bd", "#8c564b", "#915B51", "#EDC844",  "#5F021F", "#FF6600",
                    "#097054", "#FFDE00", "#6599FF", "#FF9900", "#009A31", "#00578A", "#336699", "#FF0080", "#663399", "#028482",
                    "#336699", "#FF0080", "#990033", "#266A2E", "#421C52", "#CA278C", "#EF597B", "#000044", "#B22222", "#FFFF33"];

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
