import { Component, OnInit, NgZone, AfterViewInit, OnDestroy, EventEmitter } from '@angular/core';

import { NodeService } from 'src/core/services/data';
import { PeersSignalRService } from 'src/core/services/signal-r';
import * as CONST from 'src/core/common/constants';

import { ApiPeerModel } from 'src/models';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
import * as am4charts from "@amcharts/amcharts4/charts";

import am4geodata_worldLow from '@amcharts/amcharts4-geodata/worldLow';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { MapChart } from '@amcharts/amcharts4/maps';
import { BaseComponent } from 'src/components/base/base.component';

am4core.useTheme(am4themes_animated);

declare var $;

@Component({
    selector: 'app-map-graph',
    templateUrl: './map-graph.component.html'
})
export class MapGraphComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
    private chart: am4maps.MapChart;
    private chartSlider: am4core.Slider;

    drawRpc: boolean = true;
    drawPeers: boolean = true;
    drawRpcConnections: boolean = true;
    drawPeerConnections: boolean = false;

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
        private peersSignalRService: PeersSignalRService) {
        super();
    }

    ngOnInit(): void {
        this.nodeService.startUpdatingAll();

        this.peersSignalRService.registerAdditionalEvent('list', this.peersListInited);
        this.peersSignalRService.registerAdditionalEvent('new', this.newPeerFound);

        this.addSubsctiption(
            this.peersListInited.subscribe(x => {
                this.peers = x;
                this.checkStatus.emit();
            })
        );

        this.addSubsctiption(this.newPeerFound.subscribe(x => this.peers.push(x)));

        this.addSubsctiption(
            this.peersSignalRService.connectionEstablished.subscribe(x => {
                if (x) {
                    this.peersSignalRService.invokeOnServerEvent('InitInfo', 'caller');
                }
            })
        );

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

        this.chart = null;
        this.clearSubscriptions();
    }

    ngAfterViewInit() {
        this.allNodes = this.nodeService.allNodes;
        if (this.allNodes.length > 0) {
            this.checkStatus.emit();
        }

        $('title:contains("Chart created using amCharts library")').parent().hide();

        this.addSubsctiption(
            this.nodeService.updateNodes.subscribe(x => {
                this.allNodes = x;
                this.checkStatus.emit();
            })
        );

        this.addSubsctiption(
            this.checkStatus.subscribe(x => {
                const connections = this.allNodes.map(z => z.connectedPeers).filter(z => z !== undefined);
                if (this.peers.length > 0 && this.allNodes.length > 0 && connections.length > 0) {
                    this.updateMapInfo();
                }
            })
        );
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
                    .map(p => p.address.startsWith('::ffff:') 
                        ? p.address.substring(7) 
                        : p.address);

                that.connectedPeers.push(...connectedPeers);
            }
        });

        this.connectedPeers = this.connectedPeers.filter((value, index, self) => self.indexOf(value) === index);
    }

    initMap() {
        if (!this.wasInitialized) {
            this.initGraphMap();
            this.chartSlider.start = 0.30;
        }
    }

    createConnections(): void {
        this.graphConnections = [];
        
        if (!this.drawRpcConnections) {
            return;
        }

        if (!this.allNodes || !this.allNodes.length) {
            return;
        }

        let allNodes = [...this.allNodes];
        
        const nodesByIps = new Map();
        allNodes.forEach(node => node.ips.forEach((ip: string) => nodesByIps.set(ip, node)));
        allNodes.forEach(node => {
            if (!node.connectedPeers) {
                return;
            }

            let connectedPeersIps = node.connectedPeers
                .map((p: any) => p.address.startsWith('::ffff:') 
                    ? p.address.substring(7) 
                    : p.address);

            connectedPeersIps.forEach((ip: string) => {
                    let connectedNode = nodesByIps.get(ip);
                    if (connectedNode) {
                        const existing = this.graphConnections.find(c =>
                            c.connectionBetween.includes(`node-${node.id}`) 
                            && c.connectionBetween.includes(`node-${connectedNode.id}`));

                        if (!existing) {
                            let connection = this.getConnectionItem(
                                node.id, 
                                connectedNode.id, 
                                node.latitude, 
                                connectedNode.latitude, 
                                node.longitude, 
                                connectedNode.longitude);

                            this.graphConnections.push(connection);
                        }
                    }
                });

            if (!this.drawPeerConnections) {
                return;
            }

            [...this.peers]
                .forEach(peer => {
                    if (connectedPeersIps.includes(peer.ip) && peer.latitude && peer.longitude) {
                        const existing = this.graphConnections.find(x =>
                            x.connectionBetween.includes(`node-${node.id}`) 
                            && x.connectionBetween.includes(`peer-${peer.id}`));

                        if (!existing) {
                            const connection = this.getConnectionItem(
                                node.id, 
                                peer.id, 
                                node.latitude, 
                                peer.latitude, 
                                node.longitude, 
                                peer.longitude);

                            this.graphConnections.push(connection);
                        }
                    }
                });
        });
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

            this.addImageSeriesWithColor(chart, 100, 'blue', true);
            this.addImageSeriesWithColor(chart, 1, '#5cb85c');
            this.setLineSeries(chart, 1);

            let drawPeersConnectionsButton = chart.chartContainer.createChild(am4core.Button);
            drawPeersConnectionsButton.label.text = 'peer lines';
            drawPeersConnectionsButton.label.fontSize = '12px';
            drawPeersConnectionsButton.padding(5, 5, 5, 5);
            drawPeersConnectionsButton.width = 80;
            drawPeersConnectionsButton.align = "left";
            drawPeersConnectionsButton.marginLeft = 10;
            drawPeersConnectionsButton.dy = 120;
            drawPeersConnectionsButton.background.fill = this.getChartButtonColor(this.drawPeerConnections);
            drawPeersConnectionsButton.events.on("hit", () => {
                this.drawPeerConnections = !this.drawPeerConnections;
                drawPeersConnectionsButton.background = new am4core.RoundedRectangle();
                drawPeersConnectionsButton.background.fill = this.getChartButtonColor(this.drawPeerConnections);

                this.lastRan = null;
                this.updateMapInfo();
            });

            let drawRpcConnectionsButton = chart.chartContainer.createChild(am4core.Button);
            drawRpcConnectionsButton.label.text = 'rpc lines';  
            drawRpcConnectionsButton.label.fontSize = '12px';          
            drawRpcConnectionsButton.padding(5, 5, 5, 5);
            drawRpcConnectionsButton.width = 80;
            drawRpcConnectionsButton.align = "left";
            drawRpcConnectionsButton.marginLeft = 10;
            drawRpcConnectionsButton.dy = 80;
            drawRpcConnectionsButton.background.fill = this.getChartButtonColor(this.drawRpcConnections);
            drawRpcConnectionsButton.events.on("hit", () => {
                this.drawRpcConnections = !this.drawRpcConnections;
                drawRpcConnectionsButton.background = new am4core.RoundedRectangle();
                drawRpcConnectionsButton.background.fill = this.getChartButtonColor(this.drawRpcConnections);

                if (!this.drawRpcConnections) {
                    this.drawPeerConnections = false;
                    drawPeersConnectionsButton.background = new am4core.RoundedRectangle();
                    drawPeersConnectionsButton.background.fill = this.getChartButtonColor(this.drawPeerConnections);
                }

                this.lastRan = null;
                this.updateMapInfo();
            });
            
            let drawPeersButton = chart.chartContainer.createChild(am4core.Button);
            drawPeersButton.label.text = 'peer nodes';
            drawPeersButton.label.fontSize = '12px';
            drawPeersButton.padding(5, 5, 5, 5);
            drawPeersButton.width = 80;
            drawPeersButton.align = "left";
            drawPeersButton.marginLeft = 10;
            drawPeersButton.dy = 40;
            drawPeersButton.background.fill = this.getChartButtonColor(this.drawPeers);
            drawPeersButton.events.on("hit", () => {
                this.drawPeers = !this.drawPeers;
                drawPeersButton.background =  new am4core.RoundedRectangle();
                drawPeersButton.background.fill = this.getChartButtonColor(this.drawPeers);

                if (!this.drawPeers) {
                    this.drawPeerConnections = false;
                    drawPeersConnectionsButton.background = new am4core.RoundedRectangle();
                    drawPeersConnectionsButton.background.fill = this.getChartButtonColor(this.drawPeerConnections);
                }

                this.lastRan = null;
                this.updateMapInfo();
            });

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

    addImageSeriesWithColor(
        chart: MapChart, 
        index: number, 
        color: string, 
        clickable: boolean = false,
        borderColor: string = '#fff') {

        const imageSeries = chart.series.push(new am4maps.MapImageSeries());
        const imageTemplate = imageSeries.mapImages.template;
        imageTemplate.tooltipText = '{title}';
        imageTemplate.nonScaling = true;
        if (clickable) {
            imageTemplate.url = 'node/{id}';
        }

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
        imageSeries.zIndex = 100;

        if (!this.drawRpc) {
            const rpcCount = this.chart.series.values[1].data.length;
            this.chart.series.values[1].removeData(rpcCount);
        } else {
            [...this.allNodes].forEach(node => {
                if (imageSeries.data.findIndex(x => x.id === node.id) === -1) {
                    const entry = {
                        'id': node.id,
                        'url': `node/${node.id}`,
                        'svgPath': this.targetSVG,
                        'title': node.url,
                        'latitude': node.latitude,
                        'longitude': node.longitude,
                        'scale': 1,
                        'clickable': true
                    };
    
                    imageSeries.addData(entry);
                }
            });
        }
    }

    setPeersChartPoints() {
        const nodeSeries = this.chart.series.values[1] as am4maps.MapImageSeries;
        const peerSeries = this.chart.series.values[2] as am4maps.MapImageSeries;

        if (!this.drawPeers) {
            const peersCount = this.chart.series.values[2].data.length;
            this.chart.series.values[2].removeData(peersCount);
        } else {
            const peers = this.peers.slice(0);
    
            for (const peer of peers) {
                if (nodeSeries.data.findIndex(x => x.id === peer.nodeId) === -1 
                    && peerSeries.data.findIndex(x => x.id === peer.id) === -1 
                    && peer.latitude 
                    && peer.longitude 
                    && this.connectedPeers.findIndex(x => x === peer.ip) !== -1) {
    
                    const entry = {
                        'id': peer.id,
                        'svgPath': this.targetSVG,
                        'title': peer.ip,
                        'latitude': peer.latitude,
                        'longitude': peer.longitude,
                        'scale': 1
                    };
    
                    peerSeries.addData(entry);
                }
            }
        }
    }

    setChartConnectionsData() {
        this.createConnections();

        const lineSeries = this.chart.series.values[3] as am4maps.MapLineSeries;
        const lines = this.graphConnections
            .map(x => {
                return { 'multiGeoLine': x.multiGeoLine };
            });

        const connectionsCount = this.chart.series.values[3].data.length;
        lineSeries.removeData(connectionsCount);
        lineSeries.addData(lines);

        this.updateLinesIterator = 1;
        this.defaultIterationsToWait = 6;
    }

    private getChartButtonColor(value: boolean) {
        return value ? am4core.color('#5bc0de') : am4core.color('#DDD');
    }

    private getConnectionItem(
        firstId: number, 
        secondId: number, 
        firstLatitude: number, 
        secondLatitude: number, 
        firstLongitude: number, 
        secondLongitude: number) {

        const connection = {
            'connectionBetween': [
                `node-${firstId}`,
                `node-${secondId}`
            ],
            'multiGeoLine': [
                [
                    {
                        'latitude': firstLatitude,
                        'longitude': firstLongitude
                    },
                    {
                        'latitude': secondLatitude,
                        'longitude': secondLongitude
                    }
                ]
            ]
        };

        return connection;
    }
}
