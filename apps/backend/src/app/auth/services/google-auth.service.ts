import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleAuthService {
  googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }

    return {
      message: 'User info from Google',
      user: req.user,
    };
  }
}
