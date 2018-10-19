import { Component, OnInit } from '@angular/core';
import { NodeService } from 'src/core/services/node.service';

declare var $;

@Component({
    selector: `app-map`,
    templateUrl: `./map.component.html`,
    styleUrls: [`./map.component.css`]
})
export class MapComponent implements OnInit {
    constructor(private _nodeService: NodeService) { }

    ngOnInit(): void {
        this.subscribeToEvents();
    }

    private subscribeToEvents() {
        this._nodeService.updateMarkers.subscribe((markers: any[]) => {
            this.initMap(markers);
        });
    }

    private initMap(markers) {
        console.log(`markers`, markers);
        $('#world-map').html('');
        $('#world-map').css('height', '412px');
        $('#world-map').vectorMap({
            map: 'world_mill_en',
            backgroundColor: 'transparent',
            markers: markers,

            hoverOpacity: 0.7,
            hoverColor: false,
            markersSelectable: true,
            onMarkerSelected: (e: any, code: string, isSelected: boolean, selectedMarkers: any[]) => {
                $('div.jvectormap-container').trigger('markerLabelShow', [map.label, code]);
            },
            onMarkerClick: (e: any, code: string) => {

            },
            onRegionLabelShow: (e: any) => {
                e.preventDefault();
            },
            onMarkerLabelShow: (e: any, label: any, code: string) => {
                label.html(`
                    <div class="map-label padding-5">
                        <h4 style="color: white">${markers[code].name}</h4>
                        <p class="no-margin">
                            ${markers[code].version}
                            <br/>
                            ${markers[code].blockCount}
                        </p>
                    </div>
                `);
            },
            onMarkerTipShow: (e: any, tip: any, code: string) => {
            }
        });

        const map = $('#world-map').vectorMap('get', 'mapObject');

        $(window).resize(function () {
            $('#world-map').css('height', '412px');
        });
    }
}
