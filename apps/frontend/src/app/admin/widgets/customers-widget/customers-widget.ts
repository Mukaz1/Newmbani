import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { SocketService } from '../../../socket.io/socket-io.service';
import { Customer, HttpResponseInterface, SOCKET_NAMESPACES, SocketIoEnums } from '@newmbani/types';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-customers-widget',
  imports: [RouterLink],
  templateUrl: './customers-widget.html',
  styleUrl: './customers-widget.scss',
})
export class CustomersWidget implements OnInit {
  private readonly socketService = inject(SocketService);
  total = 0;
  customers: Customer[] = [];
  @Output() totalClients = new EventEmitter<number>();

  constructor() {
    this.socketService.getSocket(SOCKET_NAMESPACES.CUSTOMERS).emit(SocketIoEnums.customerReports, {});
  }

  ngOnInit(): void {
    this.socketService.getSocket().on(
      SocketIoEnums.customerReports,
      (
        data: HttpResponseInterface<{
          customers: Customer[];
          total: number;
        } | null>
      ) => {
        this.customers = data.data?.customers ?? [];
        this.total = data.data?.total ?? 0;
        this.totalClients.emit(this.total);
      }
    );
  }
}
