import { Component, OnInit, NgZone, AfterViewInit, OnDestroy } from '@angular/core';
import { NodeService } from 'src/core/services/data';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';

import am4geodata_worldLow from '@amcharts/amcharts4-geodata/worldLow';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

am4core.useTheme(am4themes_animated);

declare var $;

@Component({
    selector: 'app-map-graph',
    templateUrl: './map-graph.component.html'
})
export class MapGraphComponent implements OnInit, AfterViewInit, OnDestroy {
    private chart: am4maps.MapChart;
    private chartSlider: am4core.Slider;
    allNodes: any[];
    graphMarkers: any[];
    graphConnections: any[];

    updateLinesIterator = 1;
    defaultIterationsToWait = 2;
    wasInitialized = false;

    // tslint:disable-next-line:max-line-length
    private targetSVG = `M9,0C4.029,0,0,4.029,0,9s4.029,9,9,9s9-4.029,9-9S13.971,0,9,0z M9,15.93 c-3.83,0-6.93-3.1-6.93-6.93S5.17,
    2.07,9,2.07s6.93,3.1,6.93,6.93S12.83,15.93,9,15.93 M12.5,9c0,1.933-1.567,3.5-3.5,3.5S5.5,10.933,5.5,9S7.067,5.5,9,5.5
    S12.5,7.067,12.5,9z`;

    constructor(private nodeService: NodeService, private zone: NgZone) { }

    ngOnInit(): void {
    }

    ngOnDestroy() {
        this.zone.runOutsideAngular(() => {
            if (this.chart) {
                this.chart.dispose();
            }
        });
    }

    ngAfterViewInit() {
        this.allNodes = this.nodeService.allNodes;
        this.updateMapInfo();

        $('title:contains("Chart created using amCharts library")').parent().hide();

        this.nodeService.updateNodes.subscribe(x => {
            this.allNodes = x;
            this.updateMapInfo();
        });
    }

    updateMapInfo(): void {
        if (this.allNodes.length === 0) {
            return;
        }

        if (!this.wasInitialized) {
            this.initGraphMap();
            this.chartSlider.start = 0.30;
        }

        this.setChartData();
        this.setChartConnectionsData();
    }

    createConnections(): void {
        this.graphConnections = [];

        for (let i = 0; i < this.allNodes.length - 1; i++) {
            const firstNode = this.allNodes[i];

            if (!firstNode.connectedPeers) continue;

            const firstNodeConnected = firstNode.connectedPeers
                .map(p => p.address.startsWith('::ffff:') ? p.address.substring(7) : p.address);

            for (let j = i + 1; j < this.allNodes.length; j++) {

                const secondNode = this.allNodes[j];

                for (const ip of secondNode.ips) {
                    if (firstNodeConnected.includes(ip)) {
                        this.graphConnections.push({
                            'multiGeoLine': [
                                [
                                    {
                                        'latitude': firstNode.latitude,
                                        'longitude': firstNode.longitude
                                    },
                                    {
                                        'latitude': secondNode.latitude,
                                        'longitude': secondNode.longitude
                                    }
                                ]
                            ]
                        });
                    }
                }
            }
        }
    }

    initGraphMap(): void {
        this.zone.runOutsideAngular(() => {
            // Create map instance
            const chart = am4core.create('chartdiv', am4maps.MapChart);
            chart.seriesContainer.draggable = false;
            chart.seriesContainer.resizable = false;

            // Set map definition
            chart.geodata = am4geodata_worldLow;

            // Set projection
            // chart.projection = new am4maps.projections.Miller();
            chart.projection = new am4maps.projections.Orthographic();

            const slider = chart.chartAndLegendContainer.createChild(am4core.Slider);
            slider.start = 0.31;
            slider.margin(20, 0, 20, 0);
            slider.valign = 'bottom';
            slider.align = 'center';
            slider.width = 500;
            slider.events.on('rangechanged', function (ev) {
                const deltaLongitude = 360 * ev.target.start - 180;
                chart.deltaLongitude = deltaLongitude;
            });

            this.chartSlider = slider;

            // Add zoom control
            // chart.zoomControl = new am4maps.ZoomControl();

            // Set initial zoom
            chart.homeZoomLevel = 0;
            chart.maxZoomLevel = 1;

            // Create map polygon series
            const polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
            polygonSeries.exclude = ['AQ'];
            polygonSeries.useGeodata = true;
            polygonSeries.mapPolygons.template.fill = chart.colors.getIndex(0).lighten(0.5);


            // Add images
            const imageSeries = chart.series.push(new am4maps.MapImageSeries());
            const imageTemplate = imageSeries.mapImages.template;
            imageTemplate.tooltipText = '{title}';
            imageTemplate.nonScaling = true;

            const marker = imageTemplate.createChild(am4core.Sprite);
            marker.path = this.targetSVG;
            marker.horizontalCenter = 'middle';
            marker.verticalCenter = 'middle';
            marker.fill = chart.colors.getIndex(1).brighten(-0.5);

            imageTemplate.propertyFields.latitude = 'latitude';
            imageTemplate.propertyFields.longitude = 'longitude';

            const lineSeries = chart.series.push(new am4maps.MapLineSeries());
            lineSeries.dataFields.multiGeoLine = 'multiGeoLine';
            lineSeries.autoDispose = false;

            const lineTemplate = lineSeries.mapLines.template;
            lineTemplate.nonScalingStroke = true;
            lineTemplate.stroke = chart.colors.getIndex(1).brighten(-0.5);

            this.chart = chart;

            this.wasInitialized = true;

            $('title:contains("Chart created using amCharts library")').parent().hide();
        });
    }

    setChartData() {
        const imageSeries = this.chart.series.values[1] as am4maps.MapImageSeries;

        for (const node of this.allNodes) {
            if (imageSeries.data.findIndex(x => x.id === node.id) === -1) {
                imageSeries.data.push({
                    'id': node.id,
                    'svgPath': this.targetSVG,
                    'title': node.url,
                    'latitude': node.latitude,
                    'longitude': node.longitude,
                    'scale': 1
                });
            }
        }
    }

    setChartConnectionsData() {
        if (this.updateLinesIterator % this.defaultIterationsToWait === 0) {
            this.createConnections();
            const lineSeries = this.chart.series.values[2] as am4maps.MapLineSeries;

            lineSeries.data = this.graphConnections;
            this.updateLinesIterator = 1;
            this.defaultIterationsToWait = 10;
        } else {
            this.updateLinesIterator++;
        }
    }
}
