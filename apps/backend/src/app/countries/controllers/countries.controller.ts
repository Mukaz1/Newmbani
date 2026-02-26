import {
  ExpressQuery,
  HttpResponseInterface,
  PermissionEnum,
  UserRequest,
} from '@newmbani/types';
import { GenericResponse } from '../../common/decorators/generic-response.decorator';
import { CountriesService } from '../services/countries.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthenticationGuard } from '../../auth/guards/authentication.guard';
import { RequiredPermissions } from '../../auth/decorators/permissions.decorator';
import { AuthorizationGuard } from '../../auth/guards/authorization.guard';
import { UpdateCountryDto } from '../dto/country.dto';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  /**
   * Get all the supported countries
   *
   * @param {GenericResponse} res
   * @return {*}  {Promise<HttpResponseInterface>}
   * @memberof CountriesController
   */
  @Get()
  async getCountries(
    @Query() query: ExpressQuery,
    @GenericResponse() res: GenericResponse
  ): Promise<HttpResponseInterface> {
    // get the countries
    const response = await this.countriesService.getAllCountries(query);
    // set response status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  @Get(':id')
  // @UseGuards(AuthenticationGuard, AuthorizationGuard)
  // @RequiredPermissions(PermissionEnum.VIEW_PROPERTY)
  async findOne(
    @Param('id') id: string,
    @GenericResponse() res: GenericResponse
  ): Promise<HttpResponseInterface> {
    const response = await this.countriesService.findOne(id);
    res.setStatus(response.statusCode);
    return response;
  }

  // @Patch(':id')
  // @UseGuards(AuthenticationGuard, AuthorizationGuard)
  // @RequiredPermissions(PermissionEnum.UPDATE_COUNTRY)
  // async update(
  //   @Param('id') id: string,
  //   @Body() updateCountryDto: UpdateCountryDto,
  //   @Req() { user }: UserRequest,
  //   @GenericResponse() res: GenericResponse
  // ): Promise<HttpResponseInterface> {
  //   const userId = user._id.toString();
  //   // Update property category
  //   const response = await this.countriesService.update(
  //     id,
  //     updateCountryDto,
  //     userId
  //   );
  //   // set status code
  //   res.setStatus(response.statusCode);
  //   // return response
  //   return response;
  // }

  @Patch(':id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @RequiredPermissions(PermissionEnum.UPDATE_COUNTRY)
  @UsePipes(
    new ValidationPipe({
      whitelist: true, // Remove unknown properties
      forbidNonWhitelisted: true, // Throw error for unknown properties
      transform: true, // Transform payloads to DTO instances
    })
  )
  async update(
    @Param('id') id: string,
    @Body() updateCountryDto: UpdateCountryDto,
    @Req() { user }: UserRequest,
    @GenericResponse() res: GenericResponse
  ): Promise<HttpResponseInterface> {
    try {
      const userId = user._id.toString();
      // this.logger.log(
      //   `Updating country ${id} by user ${userId}`,
      //   updateCountryDto
      // );

      const response = await this.countriesService.update(
        id,
        updateCountryDto,
        userId
      );

      res.setStatus(response.statusCode);
      return response;
    } catch (error) {
      // this.logger.error(`Error updating country ${id}:`, error);
      // throw error;
    }
  }
}
