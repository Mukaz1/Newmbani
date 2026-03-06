import { Controller, Get, UseGuards, Req, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { HttpResponseInterface, User } from '@newmbani/types';
import { AuthenticationGuard } from './auth/guards/authentication.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Post('sync-database')
  @UseGuards(AuthenticationGuard)
  async syncDefaultData(
    @Req() req: { user: User }
  ): Promise<HttpResponseInterface<null>> {
    const userId: string = req.user._id.toString();
    return this.appService.syncSystem(userId);
  }

  
}
