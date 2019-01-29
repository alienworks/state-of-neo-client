import { Component, Input, OnInit } from '@angular/core';

import * as CONST from './../../../core/common/constants';

import Chart from 'chart.js';
import { ChartService } from 'src/core/services/data';
import { ChartDataItemModel } from 'src/models';

declare var $;

@Component({
    selector: 'app-horizontal-bar-chart',
    templateUrl: './horizontal-bar-chart.component.html'
})
export class HorizontalBarChartComponent implements OnInit {
    @Input() endpoint: string;
    @Input() label: string;
    @Input() chartType = 'line';
    @Input() title: string;
    @Input() height: string;

    chartData: ChartDataItemModel[];
    isLoading: boolean;
    id: any;
    chart: Chart;

    constructor(private chartService: ChartService) { }

    ngOnInit(): void {
        this.id = this.label;
        this.getChart();
    }

    getChart() {
        $(`#container-${this.id}`).hide();
        this.isLoading = true;
        this.chartService.getChartGet(this.endpoint)
            .subscribe(x => {
                this.chartData = x.reverse();
                this.initChart();
            }, err => console.log(err));
    }

    initChart() {
        const horizontalBarChartData = {
            labels: this.getChartLabels(),
            datasets: [{
                label: null,
                backgroundColor: CONST.ColorPalet,
                data: this.getChartData()
            }]
        };

        const ctx = document.getElementById(this.label);
        this.chart = new Chart(ctx, {
            type: 'horizontalBar',
            data: horizontalBarChartData,
            options: {
                // Elements options apply to all of the options unless overridden in a dataset
                // In this case, we are setting the border of each horizontal bar to be 2px wide
                elements: {
                    rectangle: {
                        borderWidth: 2,
                    }
                },
                tooltips: {
                    callbacks: {
                        label: function (tooltipItem) {
                            return tooltipItem.xLabel;
                        }
                    }
                },
                responsive: true,
                legend: {
                    display: false,
                },
                title: {
                    display: true,
                    text: this.title
                }
            }
        });

        this.isLoading = false;
        $(`#container-${this.id}`).show(1000);
    }

    private getChartData() {
        const result = this.chartData
            .sort((a, b) => b.value - a.value)
            .slice(0, 20)
            .map(x => x.value);

        return result;
    }

    private getChartLabels() {
        const result = this.chartData
            .sort((a, b) => b.value - a.value)
            .slice(0, 20)
            .map(x => x.label);

        return result;
    }
}
