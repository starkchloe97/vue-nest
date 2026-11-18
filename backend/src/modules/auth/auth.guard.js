import { Injectable, UnauthorizedException } from '@nestjs/common';
import jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard {
  canActivate(context) {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.admin_token;
    if (!token || !process.env.JWT_SECRET) {
      throw new UnauthorizedException('Authentication required.');
    }

    try {
      request.admin = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
      return true;
    } catch {
      throw new UnauthorizedException('Session is invalid or expired.');
    }
  }
}
