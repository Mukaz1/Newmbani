import {
  AfterViewInit,
  Component,
  computed,
  effect,
  signal,
  viewChild,
} from '@angular/core';
import * as echarts from 'echarts';
@Component({
  selector: 'app-doughnut-chart',
  imports: [],
  templateUrl: './doughnut-chart.html',
  styleUrl: './doughnut-chart.scss',
})
export class DoughnutChart implements AfterViewInit {
  listingBookingStats = signal<{ title: string; count: number }[]>([]);

  readonly chartEl = viewChild<any>('chartRef');

  chartInstance: echarts.ECharts | null = null;

  chartColors: string[] = [
    '#367a9d',
    '#90bf56',
    '#e3756b',
    '#fcae47',
    '#34613a',
    '#775DD0',
  ];

  chartData = computed(() => {
    const stats = this.listingBookingStats() ?? [];
    return stats.map((listing, i) => ({
      value: listing.count,
      name: listing.title,
      itemStyle: {
        color: this.chartColors[i % this.chartColors.length],
      },
    }));
  });

  constructor() {
    // Live reactive redraw
    effect(() => {
      if (this.chartEl()?.nativeElement && this.chartInstance) {
        this.renderChart();
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => this.renderChart());
  }

  // ⭐ API for parent to set real data
  setChartData(listingStats: { title: string; count: number }[]) {
    this.listingBookingStats.set(listingStats);
    this.renderChart();
  }

  renderChart() {
    const el = this.chartEl()?.nativeElement;
    if (!el) return;

    if (this.chartInstance) {
      echarts.dispose(this.chartInstance);
      this.chartInstance = null;
    }

    this.chartInstance = echarts.init(el);

    const data = this.chartData();

    const option = {
      tooltip: { trigger: 'item' },
      legend: {
        top: '5%',
        left: 'center',
      },
      series: [
        {
          name: 'Bookings',
          type: 'pie',
          radius: ['35%', '75%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 8,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: { show: false },
          emphasis: {
            label: {
              show: true,
              fontSize: 18,
              fontWeight: 'bold',
            },
          },
          labelLine: { show: false },
          data,
        },
      ],
    };

    this.chartInstance.setOption(option);
  }
}
