import { Component, Input, OnInit } from '@angular/core';
import { ChartService } from 'src/core/services/data';
import { ChartDataItemModel } from 'src/models';
import * as CONST from 'src/core/common/constants';

import Chart from 'chart.js';

declare var $;

@Component({
    selector: 'app-pie-chart',
    templateUrl: './pie-chart.component.html'
})
export class PieChartComponent implements OnInit {
    @Input() endpoint: string;
    @Input() label: string;

    data: ChartDataItemModel[];
    chart: Chart;
    isLoading: boolean;
    id: string;

    isInitialized: boolean;

    constructor(private chartService: ChartService) { }

    ngOnInit(): void {
        this.id = this.endpoint.toLowerCase().split('/').join('-').split('?').join('-').split('=').join('-');


        $(`#container-${this.id}`).hide();

        this.chartService.getChartGet(this.endpoint)
            .subscribe(x => {
                this.data = x;
                
                this.initChart();
            }, err => console.log(`could not load pie-chart from ${this.endpoint}`, err));
    }

    randomScalingFactor() {
        return Math.round(Math.random() * 100);
    }

    initChart() {
        const ctx = document.getElementById(this.id);
        this.chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: this.chartLabels,
                datasets: [{
                    label: this.label,
                    data: this.chartData,
                    backgroundColor: CONST.ColorPalet,
                    borderWidth: 1
                }]
            },
            options: {}
        });

        this.isLoading = false;
        $(`#container-${this.id}`).show(1000);
    }

    get chartLabels(): any {
        const result = this.data.map(x => x.label.indexOf('Transaction') === -1 
            ? x.label 
            : x.label.substr(0, x.label.indexOf('Transaction')));

        return result;
    }

    get chartData() {
        return this.data.map(x => x.value);
    }
}
