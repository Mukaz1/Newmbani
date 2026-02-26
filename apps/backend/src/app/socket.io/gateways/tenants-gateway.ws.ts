import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import {
  Tenant,
  ExpressQuery,
  HttpResponseInterface,
  PaginatedData,
  SOCKET_NAMESPACES,
  SocketIoEnums,
} from '@newmbani/types';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../../auth/guards/ws-jwt.guard';
import { ExtendedSocket } from '../types/socket';
import { CORS_ALLOWED_URLS } from '../utils/get-allowed-urls.util';
import { TenantsService } from '../../tenants/services/tenants.service';

@WebSocketGateway({
  namespace: SOCKET_NAMESPACES.TENANTS,
  cors: {
    origin: [CORS_ALLOWED_URLS],
    credentials: true,
  },
})
export class TenantsGateway {
  constructor(private readonly tenantsService: TenantsService) {}

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(SocketIoEnums.tenantSearch)
  async tenantSearch(
    @ConnectedSocket() client: ExtendedSocket,
    @MessageBody()
    data: {
      limit: number;
      page: number;
      keyword: string;
      slim: boolean;
    },
  ) {
    try {
      const tenants: HttpResponseInterface<PaginatedData<Tenant[] | null>> =
        await this.tenantsService.getAllTenants(data as unknown as ExpressQuery);
      client.emit(SocketIoEnums.tenantSearch, tenants);
      return tenants;
    } catch (err) {
      throw new WsException(err?.message || 'Premium calculation failed');
    }
  }
}
