import { Component, OnInit } from '@angular/core';
import { AddressService } from '../../core/services/data';
import Chart from 'chart.js';

@Component({
    templateUrl: './address-index.component.html'
})
export class AddressIndexComponent implements OnInit {

    constructor(private addresses: AddressService) {
    }

    ngOnInit(): void {
        this.addresses.getChartData()
            .subscribe(x => {
                // var items = x.json();
                // let labels = [];
                // let data = [];

                // items.forEach(x => {
                //     labels.push(x.startDate);
                //     data.push(x.value);
                // });

                // const ctx = document.getElementById('myChart');
                // const myChart = new Chart(ctx, {
                //     type: 'bar',
                //     data: {
                //         labels: labels,
                //         datasets: [{
                //             label: '# of Votes',
                //             data: data,
                //             backgroundColor: [
                //                 'rgba(255, 99, 132, 0.2)',
                //                 'rgba(54, 162, 235, 0.2)',
                //                 'rgba(255, 206, 86, 0.2)',
                //                 'rgba(75, 192, 192, 0.2)',
                //                 'rgba(153, 102, 255, 0.2)',
                //                 'rgba(255, 159, 64, 0.2)'
                //             ],
                //             borderColor: [
                //                 'rgba(255,99,132,1)',
                //                 'rgba(54, 162, 235, 1)',
                //                 'rgba(255, 206, 86, 1)',
                //                 'rgba(75, 192, 192, 1)',
                //                 'rgba(153, 102, 255, 1)',
                //                 'rgba(255, 159, 64, 1)'
                //             ],
                //             borderWidth: 1
                //         }]
                //     },
                //     options: {
                //         scales: {
                //             yAxes: [{
                //                 ticks: {
                //                     beginAtZero: true
                //                 }
                //             }]
                //         }
                //     }
                // });
            });
    }
}
