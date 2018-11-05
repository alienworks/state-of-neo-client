import { Component, OnInit } from '@angular/core';
import { NodeService } from '../../core/services/data/node.service';
import { Router } from '@angular/router';

declare var $;

@Component({
    selector: `app-map`,
    templateUrl: `./map.component.html`,
    styleUrls: [`./map.component.css`]
})
export class MapComponent implements OnInit {
    mapSelector = '#world-map';
    isLoading = true;

    constructor(private _nodeService: NodeService, private router: Router) { }

    ngOnInit(): void {
        this.subscribeToEvents();
    }

    private subscribeToEvents() {
        this._nodeService.updateMarkers.subscribe((markers: any[]) => {
            this.initMap(markers);
        });
    }

    private initMap(markers) {
        $(this.mapSelector).html('');
        $(this.mapSelector).css('height', '412px');
        $(this.mapSelector).vectorMap({
            map: 'world_mill_en',
            backgroundColor: 'transparent',
            markers: markers,

            hoverOpacity: 0.7,
            hoverColor: false,
            markersSelectable: true,
            onMarkerSelected: (e: any, code: string, isSelected: boolean, selectedMarkers: any[]) => {
                $('div.jvectormap-container').trigger('markerLabelShow', [map.label, code]);
            },
            onMarkerOut: (e: any, code: string) => {
                this.clearMarkers();
            },
            onMarkerClick: (e: any, code: string) => {
                this.clearMarkers();
                this.router.navigate(['/node/' + markers[code].id]);
            },
            onRegionLabelShow: (e: any) => {
                e.preventDefault();
            },
            onMarkerLabelShow: (e: any, label: any, code: string) => {
                label.html(`
                    <div class="map-label padding-5" id="map-label-${code}">
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

        const map = $(this.mapSelector).vectorMap('get', 'mapObject');
        $(this.mapSelector).css('height', '412px');
        $(this.mapSelector).show();
        this.isLoading = false;
    }

    private clearMarkers(): void {
        $.each($('.jvectormap-label'), (x, y) => $(y).css('display', 'none'));
    }
}
