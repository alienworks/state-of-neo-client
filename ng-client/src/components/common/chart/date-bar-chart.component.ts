import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { DatePipe } from '@angular/common';

import { ChartService } from './../../../core/services/data';
import { ChartDataItemModel, UnitOfTime, ChartFilterModel } from './../../../models';
import * as CONST from './../../../core/common/constants';

import Chart from 'chart.js';

declare var $;

@Component({
    selector: 'app-date-bar-chart',
    templateUrl: './date-bar-chart.component.html'
})
export class DateBarChartComponent implements OnInit {
    @Input() endpoint: string;
    @Input() label: string;
    @Input() chartType = 'line';

    chart: Chart;
    chartData: ChartDataItemModel[];
    filter = new ChartFilterModel();
    id: string;
    isLoading = true;
    timeTypes: any[];
    periodOptions: any[];

    constructor(private datePipe: DatePipe,
        private chartService: ChartService) { }

    ngOnInit(): void {
        this.id = this.endpoint.toLowerCase().replace('/', '-');
        this.timeTypes = Object.keys(UnitOfTime)
            .filter(x => isNaN(Number(x)))
            .map(x => {
                const selected = this.filter.unitOfTime === UnitOfTime[x];
                return { key: x, selected };
            });

        this.periodOptions = new Array(31).fill(1)
            .map((x, i) => {
                const selected = i === 0 ? true : false;
                return { key: i + 6, selected };
            });

        this.getChart();
    }

    getChart() {
        $(`#container-${this.id}`).hide();
        this.isLoading = true;
        this.chartService.getChart(this.endpoint, this.filter)
            .subscribe(x => {
                this.chartData = x.json() as ChartDataItemModel[];
                this.initChart();
            }, err => console.log(err));
    }

    initChart() {
        const ctx = document.getElementById(this.id);
        this.chart = new Chart(ctx, {
            type: this.chartType,
            data: {
                labels: this.getChartLabels(),
                datasets: [{
                    label: this.label,
                    data: this.getChartData(),
                    backgroundColor: CONST.MainThemeColor,
                    // backgroundColor: CONST.ColorPalet,
                    borderWidth: 1
                }]
            },
            options: {
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'top',
                    x: -40,
                    y: 80,
                    floating: true,
                    borderWidth: 1,
                    backgroundColor: '#FFFFFF',
                    shadow: true
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });

        this.isLoading = false;
        $(`#container-${this.id}`).show(1000);
    }

    onDropdownChange(event) {
        this.filter.endPeriod = +event.target.value;
        this.chart.destroy();
        this.getChart();
    }

    private getChartData() {
        const result = this.chartData.map(x => x.value);
        return result;
    }

    private getChartLabels() {
        let format = 'dd/MM/yy';
        if (this.filter.unitOfTime === UnitOfTime.Hour) { format = 'HH:mm|dd/MMM'; }
        if (this.filter.unitOfTime === UnitOfTime.Day) { format = 'dd/MM/yyyy'; }
        if (this.filter.unitOfTime === UnitOfTime.Month) { format = 'MMM yyyy'; }
        const result = this.chartData.map(x => this.datePipe.transform(x.startDate, format));
        return result;
    }

    changeTimeType(key: string) {
        this.filter.unitOfTime = UnitOfTime[key];
        this.timeTypes.forEach(x => {
            x.key === key ? x.selected = true : x.selected = false;
        });
        this.chart.destroy();
        this.getChart();
    }

    toggleChartType() {
        if (this.chartType === 'line') {
            this.chartType = 'bar';
        } else {
            this.chartType = 'line';
        }

        this.chart.destroy();
        this.initChart();
    }

    isChartTypeLine() {
        if (this.chartType === 'line') {
            return true;
        }
        return false;
    }
}
