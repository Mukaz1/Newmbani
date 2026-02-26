import { User } from '@newmbani/types';
import { Socket } from 'socket.io';

export interface ExtendedSocket extends Socket {
  data: {
    user: User;
  };
}
