import { Global, Module } from '@nestjs/common';
import { CountriesAutomationService } from './services/countries-automation.service';
import { countryProviders } from './providers/provider';
import { CountriesController } from './controllers/countries.controller';
import { CountriesService } from './services/countries.service';

@Global()
@Module({
  providers: [CountriesAutomationService, ...countryProviders, CountriesService],
  exports: [CountriesAutomationService, ...countryProviders, CountriesService],
  controllers: [CountriesController],
})
export class CountriesModule {}
