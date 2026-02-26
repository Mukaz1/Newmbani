import { Body, Controller, Post } from '@nestjs/common';

@Controller('auth/account-links')
export class AccountLinksController {
  @Post('link-tenant')
  async linkAccountToClient(@Body() body: any) {}
}
