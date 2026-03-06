import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import {
  Customer,
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
import { CustomersService } from '../../customers/services/customers.service';

@WebSocketGateway({
  namespace: SOCKET_NAMESPACES.CUSTOMERS,
  cors: {
    origin: [CORS_ALLOWED_URLS],
    credentials: true,
  },
})
export class CustomersGateway {
  constructor(private readonly customersService: CustomersService) {}

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(SocketIoEnums.customerSearch)
  async customerSearch(
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
      const customers: HttpResponseInterface<PaginatedData<Customer[] | null>> =
        await this.customersService.getAllCustomers(data as unknown as ExpressQuery);
      client.emit(SocketIoEnums.customerSearch, customers);
      return customers;
    } catch (err) {
      throw new WsException(err?.message || 'Premium calculation failed');
    }
  }
}
