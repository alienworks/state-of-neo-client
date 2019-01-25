import { Component, OnInit, NgZone, AfterViewInit, OnDestroy, EventEmitter } from '@angular/core';

import { NodeService } from 'src/core/services/data';
import { PeersSignalRService } from 'src/core/services/signal-r';
import * as CONST from 'src/core/common/constants';

import { ApiPeerModel } from 'src/models';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';

import am4geodata_worldLow from '@amcharts/amcharts4-geodata/worldLow';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { MapChart } from '@amcharts/amcharts4/maps';

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
    connectedPeers = Array.of<string>();
    graphMarkers: any[];
    graphConnections: any[];
    peers = Array.of<ApiPeerModel>();

    updateLinesIterator = 1;
    defaultIterationsToWait = 2;
    wasInitialized = false;

    // tslint:disable-next-line:max-line-length
    private targetSVG = `M9,0C4.029,0,0,4.029,0,9s4.029,9,9,9s9-4.029,9-9S13.971,0,9,0z M9,15.93 c-3.83,0-6.93-3.1-6.93-6.93S5.17,
    2.07,9,2.07s6.93,3.1,6.93,6.93S12.83,15.93,9,15.93 M12.5,9c0,1.933-1.567,3.5-3.5,3.5S5.5,10.933,5.5,9S7.067,5.5,9,5.5
    S12.5,7.067,12.5,9z`;
    peersListInited = new EventEmitter<ApiPeerModel[]>();
    newPeerFound = new EventEmitter<ApiPeerModel>();
    checkStatus = new EventEmitter<boolean>();
    lastRan: number;

    constructor(
        private nodeService: NodeService,
        private zone: NgZone,
        private peersSignalRService: PeersSignalRService
    ) { }

    ngOnInit(): void {
        this.peersSignalRService.registerAdditionalEvent('list', this.peersListInited);
        this.peersListInited.subscribe(x => {
            this.peers = x;
            this.checkStatus.emit();
        });

        this.peersSignalRService.registerAdditionalEvent('new', this.newPeerFound);
        this.newPeerFound.subscribe(x => {
            this.peers.push(x);
        });

        this.peersSignalRService.connectionEstablished.subscribe(x => {
            if (x) {
                this.peersSignalRService.invokeOnServerEvent('InitInfo', 'caller');
            }
        });

        if (this.peersSignalRService.connectionIsEstablished) {
            this.peersSignalRService.invokeOnServerEvent('InitInfo', 'caller');
        }
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

        if (this.allNodes.length > 0) this.checkStatus.emit();
        // this.updateMapInfo();

        $('title:contains("Chart created using amCharts library")').parent().hide();

        this.nodeService.updateNodes.subscribe(x => {
            this.allNodes = x;

            this.checkStatus.emit();
            // this.updateMapInfo();
        });

        this.checkStatus.subscribe(x => {
            if (this.peers.length > 0 && this.allNodes.length > 0) {
                this.updateMapInfo();
            }
        });
    }

    updateMapInfo(): void {
        if (this.allNodes.length === 0) {
            return;
        }

        const now = Date.now();
        if (!this.lastRan || (this.lastRan && this.lastRan + CONST.MinuteInMs < now)) {
            this.initMap();

            this.handleConnectedPeers();
            this.setRPCChartPoints();
            this.setPeersChartPoints();
            this.setChartConnectionsData();
            this.lastRan = Date.now();
        }
    }

    handleConnectedPeers(): void {
        const that = this;
        that.connectedPeers = Array.of<string>();
        this.allNodes.forEach(node => {
            if (node.connectedPeers && node.connectedPeers.length > 0) {
                const connectedPeers = node.connectedPeers
                    .map(p => p.address.startsWith('::ffff:') ? p.address.substring(7) : p.address);

                that.connectedPeers.push(...connectedPeers);
            }
        });
    }

    initMap() {
        if (!this.wasInitialized) {
            this.initGraphMap();
            this.chartSlider.start = 0.30;
        }
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
                        const index = this.graphConnections.findIndex(x =>
                            x.connectionBetween.includes(`node-${firstNode.id}`) &&
                            x.connectionBetween.includes(`node-${secondNode.id}`));

                        if (index === -1) {
                            this.graphConnections.push({
                                'connectionBetween': [
                                    `node-${firstNode.id}`,
                                    `node-${secondNode.id}`
                                ],
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

            const peers = this.peers.map(x => firstNodeConnected.includes(x.ip));
            for (let j = 0; j < peers.length; j++) {
                const peer = this.peers[j];

                if (firstNodeConnected.includes(peer.ip) && peer.latitude && peer.longitude) {
                    const index = this.graphConnections.findIndex(x =>
                        x.connectionBetween.includes(`node-${firstNode.id}`) &&
                        x.connectionBetween.includes(`peer-${peer.id}`));

                    if (index === -1) {
                        this.graphConnections.push({
                            'connectionBetween': [
                                `node-${firstNode.id}`,
                                `peer-${peer.id}`
                            ],
                            'multiGeoLine': [
                                [
                                    {
                                        'latitude': firstNode.latitude,
                                        'longitude': firstNode.longitude
                                    },
                                    {
                                        'latitude': peer.latitude,
                                        'longitude': peer.longitude
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

            this.addImageSeriesWithColor(chart, 100, 'blue');
            this.addImageSeriesWithColor(chart, 1, '#5cb85c');
            this.setLineSeries(chart, 6);

            this.chart = chart;

            this.wasInitialized = true;

            $('title:contains("Chart created using amCharts library")').parent().hide();
        });
    }

    setLineSeries(chart: MapChart, number: number): void {
        for (let i = 0; i < number; i++) {
            const lineSeries = chart.series.push(new am4maps.MapLineSeries());
            lineSeries.dataFields.multiGeoLine = 'multiGeoLine';
            lineSeries.autoDispose = false;

            const lineTemplate = lineSeries.mapLines.template;
            lineTemplate.nonScalingStroke = true;
            lineTemplate.stroke = chart.colors.getIndex(1).brighten(-0.5);
        }
    }

    addImageSeriesWithColor(chart: MapChart, index: number, color: string, borderColor: string = '#fff') {
        const imageSeries = chart.series.push(new am4maps.MapImageSeries());
        const imageTemplate = imageSeries.mapImages.template;
        imageTemplate.tooltipText = '{title}';
        imageTemplate.nonScaling = true;

        // new marker introduced
        const marker = imageTemplate.createChild(am4core.Circle);
        marker.radius = 6;
        marker.fill = am4core.color(color);
        marker.strokeWidth = 2;
        marker.stroke = am4core.color(borderColor);
        marker.zIndex = index;

        imageTemplate.propertyFields.latitude = 'latitude';
        imageTemplate.propertyFields.longitude = 'longitude';
    }

    setRPCChartPoints() {
        const imageSeries = this.chart.series.values[1] as am4maps.MapImageSeries;

        for (const node of this.allNodes) {
            if (imageSeries.data.findIndex(x => x.id === `node-${node.id}`) === -1) {
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

    setPeersChartPoints() {
        const nodeSeries = this.chart.series.values[1] as am4maps.MapImageSeries;
        const peerSeries = this.chart.series.values[2] as am4maps.MapImageSeries;
        const peers = this.peers.slice(0);

        for (const peer of peers) {
            if (nodeSeries.data.findIndex(x => x.id === peer.nodeId) === -1 &&
                peerSeries.data.findIndex(x => x.id === peer.id) === -1 &&
                this.connectedPeers.findIndex(x => x === peer.ip) !== -1) {

                peerSeries.data.push({
                    'id': peer.id,
                    'svgPath': this.targetSVG,
                    'title': peer.ip,
                    'latitude': peer.latitude,
                    'longitude': peer.longitude,
                    'scale': 1
                });
            }
        }
    }

    setChartConnectionsData() {
        this.createConnections();

        // Work around for the limit of 109 lines per Series
        let iteration = 0;

        for (let i = 3; i < this.chart.series.values.length; i++) {
            if (iteration > this.graphConnections.length) break;

            const lineSeries = this.chart.series.values[i] as am4maps.MapLineSeries;
            const connections = this.graphConnections.map(x => {
                return { 'multiGeoLine': x.multiGeoLine };
            }).slice(iteration, iteration + 109);

            iteration += 109;

            lineSeries.data = connections;
        }

        // const lineSeries = this.chart.series.values[4] as am4maps.MapLineSeries;

        // Current Lib max line value is 109 in next release we will add this code to run when more
        // connections are allowed by amchart
        // for (let i = 0; i < this.graphConnections.length; i += 100) {
        //     const connections = this.graphConnections.map(x => {
        //         return { 'multiGeoLine': x.multiGeoLine };
        //     }).slice(i, i + 100);
        //     lineSeries.data.push(...connections);
        // }

        // For now only 109 lines will be shown
        // const connections = this.graphConnections.map(x => {
        //     return { 'multiGeoLine': x.multiGeoLine };
        // }).slice(0, 109);
        // lineSeries.data = connections;

        this.updateLinesIterator = 1;
        this.defaultIterationsToWait = 6;
    }
}
