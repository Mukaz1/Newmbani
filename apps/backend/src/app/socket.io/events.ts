/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Customer,
  HttpResponseInterface,
  PaginatedData,
  Property,
} from '@newmbani/types';

export interface ServerToClientEvents {
  headers: (payload: any) => void;
  newMessage: (payload: { title: string; message: any }) => void;
  customerSearchResults: (payload: { customers: Customer[] }) => void;
  propertiesearchResults: (
    payload: HttpResponseInterface<PaginatedData<Property[] | null>>,
  ) => void;
  newNotification: (notification: any) => void; // TODO: add notification interface
  newRelease: (notification: {
    message: string;
    api: string;
    appVersion: string;
  }) => void; // TODO: add notification interface
}
