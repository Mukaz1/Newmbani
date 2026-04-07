import { AfterViewInit, Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgStyle, TitleCasePipe } from '@angular/common';
import { CategoriesService } from '../../pages/categories/services/categories.service';
import { PaginatedData, HttpResponseInterface, PropertyCategory } from '@newmbani/types';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-top-categories',
  imports: [NgApexchartsModule, TitleCasePipe, NgStyle],
  templateUrl: './top-categories.html',
  styleUrl: './top-categories.scss',
})
export class TopCategories implements AfterViewInit, OnInit {
  propertyCategories = signal<PropertyCategory[]>([])
  isLoading = signal(false)
  private destroy$ = new Subject()
  private propertyCategoriesService = inject(CategoriesService)

  categories = this.propertyCategories().slice(0, 3);


  readonly myChart = viewChild<any>('myChart');

  canvas: any;
  ctx: any;

ngOnInit(): void {
  this.getPropertyCategories()
}



getPropertyCategories(): void {
  this.isLoading.set(true);
  this.propertyCategoriesService
    .getCategories({
      limit:-1,
      page: 1,
      keyword: '',
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res: HttpResponseInterface<PaginatedData<PropertyCategory[]>>) => {
        const data = res.data;
        if (data) {
          this.isLoading.set(false);
          this.propertyCategories.set(res.data.data);
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        console.error('Error fetching categories:', error);
      },
    });
}
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

  options = {
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

  }
}
