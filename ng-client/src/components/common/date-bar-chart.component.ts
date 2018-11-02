import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { ChartDataItemModel, UnitOfTime, ChartFilterModel } from '../../models';
import { DatePipe } from '@angular/common';
import Chart from 'chart.js';
import { ChartService } from '../../core/services/data';

@Component({
    selector: 'app-date-bar-chart',
    templateUrl: './date-bar-chart.component.html'
})
export class DateBarChartComponent implements OnInit {
    id = 'date-bar-chart';
    chartData: ChartDataItemModel[];
    timeTypes: any[];
    chart: Chart;
    @Input() unitOfTime: UnitOfTime;
    @Input() endpoint: string;

    constructor(private datePipe: DatePipe,
        private chartService: ChartService) { }

    ngOnInit(): void {
        this.timeTypes = Object.keys(UnitOfTime)
            .filter(x => isNaN(Number(x)))
            .map(x => {
                const selected = this.unitOfTime === UnitOfTime[x];
                return { key: x, selected };
            });

        this.getChart();
    }

    getChart() {
        const data = new ChartFilterModel();
        data.unitOfTime = this.unitOfTime;
        this.chartService.getChart(this.endpoint, data)
            .subscribe(x => {
                this.chartData = x.json() as ChartDataItemModel[];
                this.initChart();
            }, err => console.log(err));
    }

    initChart() {
        const ctx = document.getElementById(this.endpoint);
        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this.getChartLabels(),
                datasets: [{
                    label: 'Transactions',
                    data: this.getChartData(),
                    backgroundColor: '#079098',
                    // backgroundColor: [
                    //     '#079098', '#cad04a', '#456177', '#869514', '#e3e7e8', '#272c2f', '#6b6e73', '#e3e7e8', '#6AF9C4'
                    // ],
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
    }

    private getChartData() {
        const result = this.chartData.map(x => x.value);
        return result;
    }

    private getChartLabels() {
        let format = 'dd/MM/yy';
        if (this.unitOfTime === UnitOfTime.Hour) { format = 'HH:mm|dd/MMM'; }
        if (this.unitOfTime === UnitOfTime.Day) { format = 'dd/MM/yyyy'; }
        if (this.unitOfTime === UnitOfTime.Month) { format = 'MMM yyyy'; }
        const result = this.chartData.map(x => this.datePipe.transform(x.startDate, format));
        return result;
    }

    changeTimeType(key: string) {
        this.unitOfTime = UnitOfTime[key];
        this.timeTypes.forEach(x => {
            x.key === key ? x.selected = true : x.selected = false;
        });
        this.chart.destroy();
        this.getChart();
    }
}
