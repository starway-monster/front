import { ColorsMappingService } from './../../services/colors-mapping.service';
import { Observable } from 'rxjs';
import { ZoneEventsHandlerService, HoveredConnection } from './../../services/zone-events-handler.service';
import { ChangeDetectionStrategy, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import { ChordSubgroup, DefaultArcObject } from 'd3';

export interface ChordsData {
  source: string;
  target: string;
  value: number;
}

@Component({
  selector: 'sm-dependency-wheel-chart',
  templateUrl: './dependency-wheel-chart.component.html',
  styleUrls: ['./dependency-wheel-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DependencyWheelChartComponent implements OnInit {
  @Input()
  data: ChordsData[] = [];

  @Input()
  names: string[] = [];

  @Input()
  hoveredChord: ChordsData;

  @Input()
  hoveredGroup: string;

  matrix: number[][];
  width = 900;
  height = this.width;
  innerRadius = Math.min(this.width, this.height) * 0.5 - 20;
  outerRadius = this.innerRadius + 20;
  ribbon = d3.ribbon()
    .radius(this.innerRadius - 15)
    .padAngle(1 / this.innerRadius);
  arc = d3.arc()
    .innerRadius(this.innerRadius)
    .outerRadius(this.outerRadius)
  chord = d3.chordDirected()
    .padAngle(0.04)
    .sortSubgroups(d3.ascending)
    .sortChords(d3.descending)
  formatValue = x => `${x.toFixed(0)}B`;
  svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
  hoveredZone$: Observable<string[]>;

  constructor(private readonly zoneEventsHandlerService: ZoneEventsHandlerService,
    private readonly colorsMappingService: ColorsMappingService
    ) {  }

  ngOnInit(): void {
    this.hoveredZone$ = this.zoneEventsHandlerService.hoveredZones$;

    this.zoneEventsHandlerService.hoveredZones$
      .subscribe((hoveredZone) => {
        this.handleGroupHover(hoveredZone);
      })

    this.zoneEventsHandlerService.hoveredConnections$
      .subscribe((hoveredConnections) => {
        this.handleChordHover(hoveredConnections);
      })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes.data || changes.names) && this.data && this.names && this.names.length) {
      this.updateChart();
    }
  }

  public colors = (name: string) => this.colorsMappingService.getColorByZone(name);

  public hoverItem(hoveredZone: string) {
    this.zoneEventsHandlerService.setHoveredZones(hoveredZone);
  }

  private updateChart() {
    if (this.svg) {
      d3.select('svg').remove();
    }
    this.svg = this.createSvg();
    this.createChart();
    this.matrix = this.getMatrix();
    this.createChords();
    this.createCircle();
  }

  private createSvg() {
    const svg = d3.select('figure#chart')
      .append('svg')
      .attr('viewBox', `${-this.width / 2} ${-this.height / 2} ${this.width} ${this.height}`);
    return svg;
  }

  private createChart() {
    this.svg.append('path')
      .attr('id', 'wheel-chart')
      .attr('fill', 'rgb(0,0,0,0.2)')
      .attr('d', d3.arc()({outerRadius: this.outerRadius, startAngle: 0, endAngle: 2 * Math.PI} as DefaultArcObject));
  }

  private createChords() {
    const grads = this.svg.append('defs')
      .selectAll('linearGradient')
      .data(this.getChordData())
      .enter()
      .append('linearGradient')
      .attr('id', d => this.getGradientId(d))
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', d => this.innerRadius * Math.cos((d.source.endAngle-d.source.startAngle) / 2 + d.source.startAngle - Math.PI/2))
      .attr('y1', d => this.innerRadius * Math.sin((d.source.endAngle-d.source.startAngle) / 2 + d.source.startAngle - Math.PI/2))
      .attr('x2', d => this.innerRadius * Math.cos((d.target.endAngle-d.target.startAngle) / 2 + d.target.startAngle - Math.PI/2))
      .attr('y2', d => this.innerRadius * Math.sin((d.target.endAngle-d.target.startAngle)));

      grads.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', d => this.colors(this.names[d.source.index]));

      grads.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', d => this.colors(this.names[d.target.index]));

    this.svg.append('g')
      .selectAll('g')
      .data(this.getChordData())
      .join('path')
        .classed('chord', true)
        .attr('d', <any>this.ribbon)
        .attr('fill-opacity', 0.3)
        .style('display', (d: any) => d.source.index === d.target.index ? 'none' : 'block')
        .style('fill', d => `url(#${this.getGradientId(d)})`)
        .style('mix-blend-mode', 'lighten')
      .on('mouseover', this.onChordMouseEvent(true))
      .on('mouseout', this.onChordMouseEvent(false));
  }

  private createCircle() {
    this.svg.append('g')
      .attr('fill-opacity', 0.3)
      .selectAll('g')
      .data(this.getChordGroupData())
      .join('g')
        .call(g => g.append('path')
          .classed('arc', true)
          .attr('d', <any>this.arc)
          .attr('fill', d => this.colors(this.names[d.index]))
      ).on('mouseover', this.onArcMouseEvent(true))
      .on('mouseout', this.onArcMouseEvent(false));
  }

  private getMatrix() {
    const index = new Map(this.names.map((name, i) => [name, i]));
    const matrix = Array.from(index, () => new Array(this.names.length).fill(0));
    for (const d of this.data)
      matrix[index.get(d.source)][index.get(d.target)] += d.value;
    const existedNames = [...new Set([...this.data.map(d => d.source), ...this.data.map(d => d.target)])];
    for (const name of this.names) {
      if (!existedNames.includes(name)) {
        matrix[index.get(name)][index.get(name)] = 0.2;
      }
    }
    return matrix;
  }

  private getChordData() {
    return this.chord(this.matrix);
  }

  private getChordGroupData() {
    return this.getChordData().groups;
  }

  private onChordMouseEvent(isOver: boolean) {
    return (mouseEvent: any, data: any) => {
      const hoveredItems = isOver ? [this.names[data.source.index], this.names[data.target.index]] : [];
      this.zoneEventsHandlerService.setHoveredZones(...hoveredItems);
      this.zoneEventsHandlerService.setHoveredConnections(
        ...[{ zone1: this.names[data.source.index], zone2: this.names[data.target.index]} as HoveredConnection]);
    }
  }

  private onArcMouseEvent(isOver: boolean) {
    return (_mouseEvent: any, data: any) => {
      const hoveredItems = isOver ? [this.names[data.index]] : [];
      this.zoneEventsHandlerService.setHoveredZones(...hoveredItems);
      let hoveredConnections = [];
      if (isOver) {
        for (let i = 0; i < this.data.length; i++) {
          const chordData = this.data[i];
          if (chordData.source === this.names[data.index]
            || chordData.target === this.names[data.index]) {
              hoveredConnections.push({ zone1: chordData.source, zone2: chordData.target })
            }
        }
      }
      this.zoneEventsHandlerService.setHoveredConnections(...hoveredConnections);
    }
  }


  private handleGroupHover(hoveredGroup: string[]) {
    d3.selectAll('.arc')
      .attr('fill-opacity', this.getOpacity(false));
    d3.selectAll('.arc')
      .filter((d: ChordSubgroup) => this.groupFilter(d, hoveredGroup))
      .attr('fill-opacity', this.getOpacity(true));
  }

  private handleChordHover(hoveredChord: HoveredConnection[]) {
    d3.selectAll('.chord')
      .attr('fill-opacity', this.getOpacity(false));
    d3.selectAll('.chord')
      .filter((d: any) => this.chordFilter(d, hoveredChord))
      .attr('fill-opacity', this.getOpacity(true));
  }

  private groupFilter(d: ChordSubgroup, group: string[]) {
    return group && group.length > 0 && group.includes(this.names[d.index]);
  }

  private chordFilter(d: any, hoveredChords: HoveredConnection[]) {
    return hoveredChords.some(chord => chord.zone1 === this.names[d.source.index] && chord.zone2 === this.names[d.target.index]
      || chord.zone2 === this.names[d.source.index] && chord.zone1 === this.names[d.target.index]);
  }

  private getOpacity(isOver: boolean) {
    return isOver ? 1 : 0.3;
  }

  private getGradientId(d: any) { return 'linkGrad-' + d.source.index + '-' + d.target.index; }
}
