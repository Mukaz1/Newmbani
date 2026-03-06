import { Global, Module } from '@nestjs/common';
import { AppWebSocketGateway } from './gateway.ws';
import { gateways } from './gateways';
import { CustomersModule } from '../customers/customers.module';
import { PropertiesModule } from '../properties/properties.module';

@Global()
@Module({
  imports: [CustomersModule, PropertiesModule],
  providers: [AppWebSocketGateway, ...gateways],
})
export class SocketGatewayModule {}
