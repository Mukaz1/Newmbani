import { Controller, Get } from '@nestjs/common';
import { ExampleService } from './example.service';

@Controller()
export class AppController {
  constructor(private readonly exampleService: ExampleService) {}

  @Get()
  getRoot() {
    return { message: 'Backend is running' };
  }

  @Get('items')
  getItems() {
    return this.exampleService.getItems();
  }
}
