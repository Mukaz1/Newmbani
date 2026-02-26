import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Country, DatabaseModelEnums, SystemEventsEnum } from '@newmbani/types';
import { CountiesData } from '../data/countries.data';
import { CreateCountryDto } from '../dto/country.dto';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class CountriesAutomationService {
  constructor(
    @Inject(DatabaseModelEnums.COUNTRY)
    private countries: Model<Country>
  ) {}

  @OnEvent(SystemEventsEnum.SyncDatabase, { async: true })
  async seed() {
    // get all the countries
    const countries = await this.countries.find().exec();
    const defaultData = CountiesData;

    for (let i = 0; i < defaultData.length; i++) {
      const country: CreateCountryDto = defaultData[i];
      const found = countries.find((a) => a.code === country.code);

      if (!found) {
        await this.countries.create(country);
      } else {
        await this.countries.findOneAndUpdate(
          { _id: found._id.toString() },
          country
        );
      }
    }
  }
}
