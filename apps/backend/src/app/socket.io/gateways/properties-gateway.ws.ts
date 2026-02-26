import {
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import {
  ExpressQuery,
  HttpResponseInterface,
  PaginatedData,
  Property,
  SOCKET_NAMESPACES,
  SocketIoEnums,
} from '@newmbani/types';
import { PropertiesService } from '../../properties/services/properties.service';
import { ExtendedSocket } from '../types/socket';
import { CORS_ALLOWED_URLS } from '../utils/get-allowed-urls.util';

@WebSocketGateway({
  namespace: SOCKET_NAMESPACES.PROPERTIES,
  cors: {
    origin: [CORS_ALLOWED_URLS],
    credentials: true,
  },
})
export class PropertiesGateway {
  constructor(private readonly propertiesService: PropertiesService) {}

  @SubscribeMessage(SocketIoEnums.propertieSearch)
  async propertiesearch(
    client: ExtendedSocket,
    data: {
      limit: number;
      page: number;
      keyword: string;
      slim: boolean;
    },
  ) {
    try {
      const properties: HttpResponseInterface<
        PaginatedData<Property[] | null>
      > = await this.propertiesService.findAll(data as unknown as ExpressQuery);
      client.emit(SocketIoEnums.propertieSearch, properties);
      return properties;
    } catch (err) {
      console.error('Property search error:', err);
      throw new WsException(err?.message || 'Property search failed');
    }
  }
}
