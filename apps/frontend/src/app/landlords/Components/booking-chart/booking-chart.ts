import {
  AfterViewInit,
  Component,
  effect,
  Input,
  signal,
  viewChild,
  OnDestroy,
} from '@angular/core';

import * as echarts from 'echarts';

@Component({
  selector: 'app-booking-chart',
  standalone: true,
  imports: [],
  templateUrl: './booking-chart.html',
  styleUrl: './booking-chart.scss',
})
export class BookingChart implements AfterViewInit, OnDestroy {
  @Input() set chartData(value: any[]) {
    this._chartData.set(value ?? []);
  }

  private _chartData = signal<any[]>([]);
  readonly chartEl = viewChild<any>('chartEl');

  chartInstance: echarts.ECharts | null = null;
  private resizeObserver: ResizeObserver | null = null;

  constructor() {
    effect(() => {
      const data = this._chartData();
      if (data.length && this.chartInstance) {
        this.renderChart();
      }
    });
  }

  ngAfterViewInit() {
    queueMicrotask(() => this.initChart());
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.chartInstance) {
      echarts.dispose(this.chartInstance);
      this.chartInstance = null;
    }
  }

  private initChart() {
    const el = this.chartEl()?.nativeElement;
    if (!el) return;

    if (this.chartInstance) {
      echarts.dispose(this.chartInstance);
    }

    this.chartInstance = echarts.init(el);
    this.renderChart();

    // Add resize observer to handle container size changes
    this.resizeObserver = new ResizeObserver(() => {
      if (this.chartInstance) {
        this.chartInstance.resize();
      }
    });
    this.resizeObserver.observe(el);
  }

  private renderChart() {
    if (!this.chartInstance) return;

    const data = this._chartData();
    if (!data.length) return;

    const months = data.map((d) => d.month);
    const revenue = data.map((d) => d.revenue);
    const counts = data.map((d) => d.count);

    const option = {
      // Make chart more mobile-friendly
      grid: {
        left: '15%',
        right: '15%',
        top: '15%',
        bottom: '15%',
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
        confine: true, // Keep tooltip within chart area on mobile
        formatter: (params: any) => {
          const p1 = params[0];
          const p2 = params[1];

          return `
            <div>
              <strong>${p1.axisValue}</strong><br/>
              Revenue: <b>KES ${p1.data}</b><br/>
              Bookings: <b>${p2.data}</b>
            </div>
          `;
        },
      },
      legend: {
        data: ['Revenue', 'Bookings'],
        top: 0,
      },
      xAxis: {
        type: 'category',
        data: months,
        axisLabel: {
          show: true,
          rotate: 45, // Rotate labels on mobile for better fit
          fontSize: 10,
        },
      },
      yAxis: [
        {
          type: 'value',
          name: 'Revenue',
          axisLabel: {
            show: true,
            fontSize: 10,
          },
          nameTextStyle: {
            fontSize: 11,
          },
        },
        {
          type: 'value',
          name: 'Bookings',
          axisLabel: {
            show: true,
            fontSize: 10,
          },
          nameTextStyle: {
            fontSize: 11,
          },
        },
      ],
      series: [
        {
          name: 'Revenue',
          type: 'line',
          data: revenue,
          smooth: true,
        },
        {
          name: 'Bookings',
          type: 'line',
          yAxisIndex: 1,
          data: counts,
          smooth: true,
        },
      ],
    };

    this.chartInstance.setOption(option);
  }
}
