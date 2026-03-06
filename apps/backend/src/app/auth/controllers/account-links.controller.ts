import { Body, Controller, Post } from '@nestjs/common';

@Controller('auth/account-links')
export class AccountLinksController {
  @Post('link-customer')
  async linkAccountToClient(@Body() body: any) {}
}
