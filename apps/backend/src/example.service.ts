import { Injectable } from '@nestjs/common';
import { ExampleItem } from '@org/types';

@Injectable()
export class ExampleService {
  getItems(): ExampleItem[] {
    return [
      { id: '1', name: 'First example item' },
      { id: '2', name: 'Second example item' },
    ];
  }
}

