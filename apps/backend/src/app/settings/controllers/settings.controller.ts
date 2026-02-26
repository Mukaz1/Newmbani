import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { SettingsService } from '../services/settings.service';
import { ApiTags } from '@nestjs/swagger';
import { UpdateGeneralSettingsDto } from '../dto/update-general-settings.dto';
import { UpdateEmailSettingsDto } from '../dto/update-email-settings.dto';
import { UpdateBrandingSettingsDto } from '../dto/update-branding-settings.dto';
import { HttpResponseInterface, PermissionEnum } from '@newmbani/types';
import { AuthenticationGuard } from '../../auth/guards/authentication.guard';
import { RequiredPermissions } from '../../auth/decorators/permissions.decorator';
import { AuthorizationGuard } from '../../auth/guards/authorization.guard';
import { GenericResponse } from '../../common/decorators/generic-response.decorator';
import { SequenceService } from '../../database/services/sequence/sequence.service';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  /**
   * Creates an instance of SettingsController.
   * @param {SettingsService} settingsService
   * @memberof SettingsController
   */
  constructor(
    private readonly settingsService: SettingsService,
    private readonly sequenceService: SequenceService,
  ) {
    //
  }

  /**
   * Get All Settings
   *
   * @param {GenericResponse} res
   * @return {*}  {Promise<HttpResponseInterface>}
   * @memberof SettingsController
   */
  @Get()
  async getSettings(
    @GenericResponse() res: GenericResponse,
  ): Promise<HttpResponseInterface> {
    // Get all system settings-wrapper
    const response = await this.settingsService.getSettings({ all: false });
    // set response status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  /**
   * Update general settings-wrapper
   *
   * @param {UpdateGeneralSettingsDto} body
   * @param {GenericResponse} res
   * @return {*}
   * @memberof SettingsController
   */
  @Patch('general')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @RequiredPermissions(PermissionEnum.UPDATE_SETTINGS)
  async updateGeneralSettings(
    @Body() body: UpdateGeneralSettingsDto,
    @GenericResponse() res: GenericResponse,
  ) {
    const response = await this.settingsService.updateGeneralSettings(body);
    // set response status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  /**
   * Update email settings-wrapper
   *
   * @param {UpdateEmailSettingsDto} body
   * @param {GenericResponse} res
   * @return {*}
   * @memberof SettingsController
   */
  @Patch('email')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @RequiredPermissions(PermissionEnum.UPDATE_SETTINGS)
  async updateEmailSettings(
    @Body() body: UpdateEmailSettingsDto,
    @GenericResponse() res: GenericResponse,
  ) {
    const response = await this.settingsService.updateEmailSettings(body);
    // set response status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  /**
   * Update email settings-wrapper
   *
   * @param {UpdateBrandingSettingsDto} body
   * @param {GenericResponse} res
   * @return {*}
   * @memberof SettingsController
   */
  @Patch('branding')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @RequiredPermissions(PermissionEnum.UPDATE_SETTINGS)
  async updateBrandingSettings(
    @Body() body: UpdateBrandingSettingsDto,
    @GenericResponse() res: GenericResponse,
  ) {
    const response = await this.settingsService.updateBrandingSettings(body);
    // set response status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  /**
   * Gets the sequence from the sequence service.
   */
  @Get('sequence')
  async getSequence() {
    return await this.sequenceService.getSequence();
  }
}
