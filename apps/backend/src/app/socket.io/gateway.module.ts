import { Global, Module } from '@nestjs/common';
import { AppWebSocketGateway } from './gateway.ws';
import { gateways } from './gateways';
import { TenantsModule } from '../tenants/tenants.module';
import { PropertiesModule } from '../properties/properties.module';

@Global()
@Module({
  imports: [TenantsModule, PropertiesModule],
  providers: [AppWebSocketGateway, ...gateways],
})
export class SocketGatewayModule {}
