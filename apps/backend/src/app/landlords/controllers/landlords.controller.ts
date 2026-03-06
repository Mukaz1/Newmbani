import { Body, Controller, Patch, Param, Post, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ExpressQuery, HttpResponseInterface, PermissionEnum, UserRequest } from '@newmbani/types';
import { GenericResponse } from '../../common/decorators/generic-response.decorator';
import { CreateLandlordDto, UpdateLandlordDto } from '../dtos/landlords.dto';
import { ApproveLandlordDto } from '../dtos/approve-landlord.dto';
import { LandlordsService } from '../services/landlords.service';
import { RequiredPermissions } from '../../auth/decorators/permissions.decorator';
import { AuthenticationGuard } from '../../auth/guards/authentication.guard';
import { AuthorizationGuard } from '../../auth/guards/authorization.guard';

@Controller('landlords')
export class LandlordsController {

    constructor(private readonly landlordsService: LandlordsService) {}

    @Post()
    async create(
      @Body() landlordDto: CreateLandlordDto,
      @GenericResponse() res: GenericResponse
    ): Promise<HttpResponseInterface> {
      // create landlord
      const response = await this.landlordsService.createLandlord(landlordDto);
      // set status code
      res.setStatus(response.statusCode);
      // return response
      return response;
    }

    /**
    *
    *
    * @return {*}  {Promise<HttpResponseInterface>}
    * @memberof LandlordsController
    */
    @Get()
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    @RequiredPermissions([PermissionEnum.VIEW_LANDLORD, PermissionEnum.MANAGE_LANDLORDS])
    async getAllLandlords(
      @Query() query: ExpressQuery,
      @GenericResponse() res: GenericResponse
    ): Promise<HttpResponseInterface> {
      // Get all landlords
      const response = await this.landlordsService.getAllLandlords(query);
      // set status code
      res.setStatus(response.statusCode);
      // return response
      return response;
    }

    /**
     * GET handler to retrieve a landlord by ID.
     *
     * @param {string} id - The ID of the landlord to retrieve.
     * @param res
     * @returns {Promise<HttpResponseInterface>} The response containing the requested landlord.
     */
    @Get(':id')
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    @RequiredPermissions([PermissionEnum.VIEW_LANDLORD, PermissionEnum.MANAGE_LANDLORDS])
    async getLandlordById(
      @Param('id') id: string,
      @GenericResponse() res: GenericResponse
    ): Promise<HttpResponseInterface> {
      // Get landlord by Id
      const response = await this.landlordsService.getLandlordById(id);
      // set status code
      res.setStatus(response.statusCode);
      // return response
      return response;
    }

    /**
     * PATCH handler to update a landlord.
     *
     * @param {string} id - The ID of the landlord to update
     * @param {UpdateLandlordDto } payload - The updated landlord data
     * @param res
     * @param {any} req - The request object
     * @returns {Promise<HttpResponseInterface>} The response from updating the landlord
     */
    @Patch(':id')
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    @RequiredPermissions([
      PermissionEnum.UPDATE_LANDLORD,
      PermissionEnum.MANAGE_LANDLORDS,
    ])
    async updateLandlord(
      @Param('id') id: string,
      @Body() payload: UpdateLandlordDto,
      @Req() { user }: UserRequest,
      @GenericResponse() res: GenericResponse
    ): Promise<HttpResponseInterface> {
      const userId = user._id.toString();
      // Update landlord
      const response = await this.landlordsService.updateLandlord(id, payload, userId);
      // set status code
      res.setStatus(response.statusCode);
      // return response
      return response;
    }

    /**
     * PATCH handler for approving a landlord.
     *
     * @param {ApproveLandlordDto} payload - The payload containing the approval data
     * @param req - The request object, which includes the user performing the action
     * @param res - The generic response decorator
     * @returns {Promise<HttpResponseInterface>} The HTTP response
     */
    @Patch(':id/approve')
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    @RequiredPermissions([
      PermissionEnum.MANAGE_LANDLORDS,
      PermissionEnum.APPROVE_LANDLORD,
    ])
    async approveLandlord(
      @Param('id') id: string,
      @Body() payload: ApproveLandlordDto,
      @Req() { user }: UserRequest,
      @GenericResponse() res: GenericResponse,
    ): Promise<HttpResponseInterface> {
      // Ensure the landlordId on the payload matches the  param if not already set
      const userId = user._id.toString();
      const response = await this.landlordsService.approveLandlord(id, payload, userId);
      res.setStatus(response.statusCode);
      return response;
    }

    }
