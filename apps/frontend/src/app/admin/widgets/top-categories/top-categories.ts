import { AfterViewInit, Component, viewChild } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { propertyCategories } from '../../../common/data/property-categories.data';
import Chart, { ChartConfiguration } from 'chart.js/auto';
import { NgStyle, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-top-categories',
  imports: [NgApexchartsModule, TitleCasePipe, NgStyle],
  templateUrl: './top-categories.html',
  styleUrl: './top-categories.scss',
})
export class TopCategories implements AfterViewInit {
  categories = propertyCategories.slice(0, 3);
  readonly myChart = viewChild<any>('myChart');

  canvas: any;
  ctx: any;

  chartData = [
    {
      value: 45,
      color: '#90bf56',
      name: this.categories[0],
    },
    {
      value: 25,
      color: '#34613a',
      name: this.categories[1],
    },
    {
      value: 30,
      color: '#fcae47',
      name: this.categories[2],
    },
  ];

  data = {
    labels: this.chartData.map((el) => el.name),
    datasets: [
      {
        data: this.chartData.map((el) => el.value),
        backgroundColor: this.chartData.map((el) => el.color),
        cutout: '70%',
        circumference: 180,
        rotation: 270,
      },
    ],
  };

  options: ChartConfiguration = {
    type: 'doughnut',
    data: this.data,
    options: {
      animation: {
        duration: 0,
      },
      elements: {
        arc: {
          borderWidth: 0,
          offset: 15,
          borderRadius: 5,
        },
      },
      layout: {},
      plugins: {
        tooltip: {
          enabled: true,
          position: 'nearest',
        },
        legend: {
          display: false,
        },
        title: {
          display: false,
        },
      },
    },
  };

  ngAfterViewInit() {
    this.canvas = this.myChart().nativeElement;
    this.ctx = this.canvas.getContext('2d');

    new Chart(this.ctx, this.options);
  }
}
