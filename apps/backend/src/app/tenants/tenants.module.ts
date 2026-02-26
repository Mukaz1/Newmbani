import { Module } from '@nestjs/common';
import { TenantsService } from './services/tenants.service';
import { TenantsController } from './controllers/tenants.controller';

@Module({
  providers: [TenantsService],
  controllers: [TenantsController],
})
export class TenantsModule {}
