import { Component, Input, OnInit, } from '@angular/core';
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

    constructor(private chartService: ChartService) { }

    ngOnInit(): void {
        this.id = this.endpoint.toLowerCase().split('/').join('-').split('?').join('-').split('=').join('-');
        console.log(this.label);
        $(`#container-${this.id}`).hide();
        this.chartService.getChartGet(this.endpoint)
            .subscribe(x => {
                this.data = x.json() as ChartDataItemModel[];
                console.log(this.data);
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
                labels: this.getChartLabels(),
                datasets: [{
                    label: this.label,
                    data: this.getChartData(),
                    backgroundColor: CONST.ColorPalet,
                    borderWidth: 1
                }]
            },
            options: { }
        });

        this.isLoading = false;
        $(`#container-${this.id}`).show(1000);
    }

    private getChartLabels(): any {
        const result = this.data.map(x => x.label);
        return result;
    }

    private getChartData() {
        const result = this.data.map(x => x.value);
        return result;
    }
}
