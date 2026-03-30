import { Body, Controller, Post } from '@nestjs/common';
import { HttpResponseInterface } from '@aluxe/types';
import { SyncSuperAdminDto } from '../dto/sync-db.dto';
import { SetupService } from '../services/setup.service';

@Controller('setup')
export class SetupController {
  constructor(private readonly setupService: SetupService) {
    //
  }

  /**
   * creates the superuser data.
   *
   * This endpoint triggers creating the superuser data throughout the application.
   */
  @Post('get-started')
  async createSuperUser(
    @Body() user: SyncSuperAdminDto
  ): Promise<HttpResponseInterface> {
    return await this.setupService.createSuperUser(user);
  }
}
