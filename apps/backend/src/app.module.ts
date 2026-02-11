import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ExampleService } from './example.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [ExampleService],
})
export class AppModule {}
